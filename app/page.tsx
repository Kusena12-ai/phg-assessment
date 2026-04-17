"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UI, Lang } from "@/lib/i18n";
import { Difficulty } from "@/lib/types";

const LEVEL_ICONS: Record<Difficulty, string> = { staff: "🟢", supervisor: "🟡", manager: "🟠", executive: "🔴" };

export default function Home() {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [position, setPosition] = useState("");
  const [lang, setLang] = useState<Lang | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();
  const t = UI[lang ?? "en"];

  const handleStart = async () => {
    if (!name.trim() || !whatsapp.trim() || !position.trim() || !lang || !difficulty) return;
    setIsNavigating(true);
    const sessionId = crypto.randomUUID();
    sessionStorage.setItem("assessment", JSON.stringify({ candidateName: name.trim(), whatsapp: whatsapp.trim(), position: position.trim(), sessionId, currentTest: 0, results: [], startTime: Date.now(), lang, difficulty }));
    await router.push("/assessment");
  };

  // Language selection screen
  if (!lang) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-lg text-center">
          <div className="flex justify-center mb-4">
            <Image src="/phg-logo.png" alt="Panna Hospitality Group" width={220} height={190} className="object-contain" priority />
          </div>
          <h1 className="text-3xl font-bold mb-8" style={{ color: "#2C2520" }}>Talent Assessment</h1>
          <p className="text-sm mb-8" style={{ color: "#8C8175" }}>Select Language / Pilih Bahasa</p>
          <div className="space-y-3">
            <button onClick={() => setLang("en")}
              className="w-full py-4 rounded-xl text-lg font-semibold transition-all"
              style={{ background: "#FFFFFF", border: "2px solid #E8E2D9", color: "#2C2520", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#B8943E"; e.currentTarget.style.background = "#FBF6ED"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#E8E2D9"; e.currentTarget.style.background = "#FFFFFF"; }}>
              🇬🇧 English
            </button>
            <button onClick={() => setLang("id")}
              className="w-full py-4 rounded-xl text-lg font-semibold transition-all"
              style={{ background: "#FFFFFF", border: "2px solid #E8E2D9", color: "#2C2520", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#B8943E"; e.currentTarget.style.background = "#FBF6ED"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#E8E2D9"; e.currentTarget.style.background = "#FFFFFF"; }}>
              🇮🇩 Bahasa Indonesia
            </button>
          </div>
          <p className="text-xs mt-6" style={{ color: "#8C8175" }}>Breaking Conventions, Inspiring Innovation</p>
        </div>
      </div>
    );
  }

  // Difficulty selection screen
  if (!difficulty) {
    const levels: { key: Difficulty; label: string; desc: string }[] = [
      { key: "staff", label: t.levelStaff, desc: t.levelStaffDesc },
      { key: "supervisor", label: t.levelSupervisor, desc: t.levelSupervisorDesc },
      { key: "manager", label: t.levelManager, desc: t.levelManagerDesc },
      { key: "executive", label: t.levelExecutive, desc: t.levelExecutiveDesc },
    ];
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-lg text-center">
          <div className="flex justify-center mb-4">
            <Image src="/phg-logo.png" alt="Panna Hospitality Group" width={180} height={155} className="object-contain" priority />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#2C2520" }}>{t.title}</h1>
          <p className="text-sm mb-8" style={{ color: "#8C8175" }}>{t.selectLevel}</p>
          <div className="space-y-3">
            {levels.map(l => (
              <button key={l.key} onClick={() => setDifficulty(l.key)}
                className="w-full py-5 px-6 rounded-xl text-left transition-all"
                style={{ background: "#FFFFFF", border: "2px solid #E8E2D9", color: "#2C2520", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#B8943E"; e.currentTarget.style.background = "#FBF6ED"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#E8E2D9"; e.currentTarget.style.background = "#FFFFFF"; }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{LEVEL_ICONS[l.key]}</span>
                  <div>
                    <p className="text-lg font-semibold">{l.label}</p>
                    <p className="text-xs" style={{ color: "#8C8175" }}>{l.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <button onClick={() => { setLang(null); }} className="mt-6 py-2 text-sm" style={{ color: "#8C8175" }}>
            ← {lang === "en" ? "Change language" : "Ganti bahasa"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-3">
            <Image src="/phg-logo.png" alt="Panna Hospitality Group" width={180} height={155} className="object-contain" priority />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#2C2520" }}>{t.title}</h1>
          <p className="text-sm" style={{ color: "#8C8175" }}>{t.tagline}</p>
        </div>

        <div className="rounded-xl p-8" style={{ background: "#FFFFFF", border: "1px solid #E8E2D9", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h2 className="text-xl font-semibold mb-2" style={{ color: "#2C2520" }}>{t.welcome}</h2>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm">{LEVEL_ICONS[difficulty]}</span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#F5F0E8", color: "#5C534A" }}>
              {difficulty === "staff" ? t.levelStaff : difficulty === "supervisor" ? t.levelSupervisor : difficulty === "manager" ? t.levelManager : t.levelExecutive}
            </span>
          </div>
          <p className="text-sm mb-6" style={{ color: "#5C534A" }}>{t.welcomeDesc}</p>

          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#5C534A" }}>{t.fullName}</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg outline-none"
                style={{ background: "#FAF8F5", border: "1px solid #E8E2D9", color: "#2C2520" }}
                placeholder={t.namePlaceholder} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#5C534A" }}>{t.whatsapp}</label>
              <input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-4 py-3 rounded-lg outline-none"
                style={{ background: "#FAF8F5", border: "1px solid #E8E2D9", color: "#2C2520" }}
                placeholder={t.whatsappPlaceholder} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#5C534A" }}>{t.position}</label>
              <input type="text" value={position} onChange={(e) => setPosition(e.target.value)}
                className="w-full px-4 py-3 rounded-lg outline-none"
                style={{ background: "#FAF8F5", border: "1px solid #E8E2D9", color: "#2C2520" }}
                placeholder={t.positionPlaceholder} />
            </div>
          </div>

          <button onClick={handleStart} disabled={!name.trim() || !whatsapp.trim() || !position.trim() || isNavigating}
            className="w-full py-3 rounded-lg font-semibold text-white transition-opacity disabled:opacity-40"
            style={{ background: "#B8943E" }}>
            {isNavigating ? "Loading..." : t.start}
          </button>

          <button onClick={() => setDifficulty(null)} className="w-full mt-3 py-2 text-sm" style={{ color: "#8C8175" }}>
            ← {lang === "en" ? "Change level" : "Ganti tingkat"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs whitespace-pre-line" style={{ color: "#8C8175" }}>{t.info}</p>
        </div>
      </div>
    </div>
  );
}
