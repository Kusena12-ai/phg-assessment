import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

const SHEET_ID = "1kAseQhOGdX4Fm9TruSEM6PovwFMMP-7m6JRUhLdvgIY";
const TAB_NAME = "Assessment Results";

async function getAuth() {
  const credentialsJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!credentialsJson) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON not set");
  const credentials = JSON.parse(credentialsJson);
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    clientOptions: { subject: "Kusena@pannahospitalitygroup.com" },
  });
}

async function ensureTab(sheets: ReturnType<typeof google.sheets>) {
  try {
    const res = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
    const exists = res.data.sheets?.some(s => s.properties?.title === TAB_NAME);
    if (!exists) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SHEET_ID,
        requestBody: { requests: [{ addSheet: { properties: { title: TAB_NAME } } }] },
      });
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: `'${TAB_NAME}'!A1:V1`,
        valueInputOption: "RAW",
        requestBody: {
          values: [["Timestamp", "Candidate Name", "WhatsApp", "Position", "Level", "Problem Solving %", "Time Management %", "OCEAN-O", "OCEAN-C", "OCEAN-E", "OCEAN-A", "OCEAN-N", "Communication %", "Overall %", "Time (min)", "Tab Switches", "OCEAN Fit %", "Composite Score", "Recommendation", "Action Plan", "Integrity Score", "Integrity Flags"]],
        },
      });
    }
  } catch (e) {
    console.error("ensureTab error:", e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const auth = await getAuth();
    const sheets = google.sheets({ version: "v4", auth });
    await ensureTab(sheets);

    const now = new Date().toLocaleString("en-GB", { timeZone: "Asia/Jakarta" });
    const levelMap: Record<string, string> = { staff: "🟢 Staff", executive: "🔴 Executive", manager: "🟠 Manager", supervisor: "🟡 Supervisor" };
    const levelLabel = levelMap[body.difficulty] || "🟡 Supervisor";
    
    // Calculate integrity score from submitted data
    const integrity = body.integrity || {};
    const integrityScore = integrity.integrityScore ?? 100;
    const integrityFlags: string[] = [];
    if ((body.tabSwitches ?? 0) > 3) integrityFlags.push(`Tab:${body.tabSwitches}`);
    if (integrity.copyPasteAttempts > 0) integrityFlags.push(`Copy:${integrity.copyPasteAttempts}`);
    if (integrity.devtoolsOpens > 0) integrityFlags.push(`DevTools:${integrity.devtoolsOpens}`);
    if (integrity.fastAnswerCount > 2) integrityFlags.push(`Fast:${integrity.fastAnswerCount}`);
    if (integrity.fullscreenExits > 2) integrityFlags.push(`FSExit:${integrity.fullscreenExits}`);
    if (integrity.autoSubmitted) integrityFlags.push("AUTO_SUBMIT");
    if (integrity.suspiciousPatterns?.length > 0) integrityFlags.push(...integrity.suspiciousPatterns);
    
    const row = [
      now,
      body.candidateName,
      body.whatsapp || "",
      body.position,
      levelLabel,
      body.problemSolving,
      body.timeManagement,
      body.oceanO,
      body.oceanC,
      body.oceanE,
      body.oceanA,
      body.oceanN,
      body.communication,
      body.overall,
      body.timeTaken,
      body.tabSwitches ?? 0,
    ];

    // Append raw data (cols A-P)
    const appendRes = await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `'${TAB_NAME}'!A:P`,
      valueInputOption: "RAW",
      requestBody: { values: [row] },
    });

    // Get the row number that was just written
    const updatedRange = appendRes.data.updates?.updatedRange || "";
    const rowMatch = updatedRange.match(/!A(\d+)/);
    const rowNum = rowMatch ? rowMatch[1] : null;

    // Write scoring formulas (cols Q-T) so they're always the correct version
    if (rowNum) {
      const n = rowNum;
      const oceanFitFormula = `=IF(D${n}="","",IFERROR(100-AVERAGE(ABS(H${n}-IF(OR(ISNUMBER(SEARCH("server",D${n})),ISNUMBER(SEARCH("barista",D${n})),ISNUMBER(SEARCH("cashier",D${n}))),70,IF(OR(ISNUMBER(SEARCH("chef",D${n})),ISNUMBER(SEARCH("kitchen",D${n})),ISNUMBER(SEARCH("bakery",D${n}))),60,70))),ABS(I${n}-IF(OR(ISNUMBER(SEARCH("server",D${n})),ISNUMBER(SEARCH("barista",D${n})),ISNUMBER(SEARCH("cashier",D${n}))),80,IF(OR(ISNUMBER(SEARCH("chef",D${n})),ISNUMBER(SEARCH("kitchen",D${n})),ISNUMBER(SEARCH("bakery",D${n}))),90,80))),ABS(J${n}-IF(OR(ISNUMBER(SEARCH("server",D${n})),ISNUMBER(SEARCH("barista",D${n})),ISNUMBER(SEARCH("cashier",D${n}))),80,IF(OR(ISNUMBER(SEARCH("chef",D${n})),ISNUMBER(SEARCH("kitchen",D${n})),ISNUMBER(SEARCH("bakery",D${n}))),60,70))),ABS(K${n}-IF(OR(ISNUMBER(SEARCH("server",D${n})),ISNUMBER(SEARCH("barista",D${n})),ISNUMBER(SEARCH("cashier",D${n}))),80,IF(OR(ISNUMBER(SEARCH("chef",D${n})),ISNUMBER(SEARCH("kitchen",D${n})),ISNUMBER(SEARCH("bakery",D${n}))),70,70))),ABS(L${n}-IF(OR(ISNUMBER(SEARCH("server",D${n})),ISNUMBER(SEARCH("barista",D${n})),ISNUMBER(SEARCH("cashier",D${n}))),60,IF(OR(ISNUMBER(SEARCH("chef",D${n})),ISNUMBER(SEARCH("kitchen",D${n})),ISNUMBER(SEARCH("bakery",D${n}))),50,60)))),""))`;
      const compositeFormula = `=IF(D${n}="","",IFERROR(ROUND(0.6*AVERAGE(F${n},G${n},N${n})+0.4*Q${n},1),""))`;
      const integrityScoreVal = integrityScore;
      const integrityFlagsStr = integrityFlags.length > 0 ? integrityFlags.join(", ") : "Clean";
      
      const recommendationFormula = `=IF(R${n}="","",IF(U${n}<50,"🚨 FLAGGED — INTEGRITY FAIL",IF(U${n}<70,"⚠️ FLAGGED — REVIEW INTEGRITY",IF(P${n}>5,"⚠️ FLAGGED",IF(R${n}>=75,"🟢 STRONG HIRE",IF(R${n}>=65,"🟢 RECOMMEND",IF(R${n}>=50,"🟡 CONSIDER","🔴 PASS")))))))`;
      const actionPlanFormula = `=IF(S${n}="","",IF(LEFT(S${n},1)="🚨","INTEGRITY FAIL: "&V${n}&". Retest mandatory in controlled environment with supervision.",IF(LEFT(S${n},1)="⚠","Review integrity: "&V${n}&". Consider retest in controlled environment.",IF(S${n}="🟢 STRONG HIRE","Fast-track: Schedule final interview within 48hrs. Offer competitive package.",IF(S${n}="🟢 RECOMMEND","Schedule panel interview. Verify references. Standard offer.",IF(S${n}="🟡 CONSIDER","Conditional: "&IF(AVERAGE(F${n},G${n})<60,"Skills gap — consider training program.","OCEAN mismatch — assess culture fit in interview."),"Do not proceed. Send polite rejection within 24hrs."))))))`;

      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: `'${TAB_NAME}'!Q${n}:V${n}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[oceanFitFormula, compositeFormula, recommendationFormula, actionPlanFormula, integrityScoreVal, integrityFlagsStr]],
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Submit error:", error);
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}
