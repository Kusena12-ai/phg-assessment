import { MCQuestion } from "./types";

// MANAGER-LEVEL: Problem Solving (12 questions)
// All 4 options are similarly comprehensive. Correct answer varies in complexity.
// Distribution target: A=3, B=3, C=3, D=3 (12 questions)
export const PS_MGR: MCQuestion[] = [
  {
    type: "mc", id: 1,
    question: "Your location's operating costs jumped from 32% to 37% of revenue this month. What's your first step?",
    options: ["Audit recent purchase orders, compare against standard specs, identify which line items caused the deviation", "Switch to cheaper suppliers across all categories, renegotiate contracts, lock in lower rates for next quarter", "Raise prices on high-margin items first, monitor customer response, adjust further based on sales velocity", "Reduce portion sizes or service levels gradually, track customer feedback, reverse changes if complaints rise"],
    correct: 0
  },
  {
    type: "mc", id: 2,
    question: "A key supplier informs you they're raising prices by 15% starting next month. They provide 40% of your materials. What do you do?",
    options: ["Get quotes from alternatives, use competing offers as leverage in negotiations with the current supplier", "Drop them entirely, source from three new suppliers, split orders to reduce single-vendor concentration risk", "Remove all products that depend on their materials, redesign the menu around remaining lower-cost ingredients", "Accept the increase to maintain the relationship, absorb the cost difference, adjust budget projections now"],
    correct: 0
  },
  {
    type: "mc", id: 3,
    question: "Your best-performing team member has been arriving late 3 times this week. Others notice the double standard. How do you handle it?",
    options: ["Have a private conversation to understand the root cause, set clear expectations, document the discussion", "Let it slide since their output exceeds targets, mention it casually, hope the behavior self-corrects soon", "Send a team-wide memo reinforcing attendance rules, increase monitoring across all shifts going forward now", "Dock their pay for the late arrivals immediately, notify HR of the action, update their personnel file now"],
    correct: 0
  },
  {
    type: "mc", id: 4,
    question: "It's your busiest day. Two key team members call in sick 2 hours before the peak period. What do you do?",
    options: ["Call off-duty staff to cover, simplify the offering to high-volume items only, redistribute key station duties", "Run with the remaining team at full capacity, extend their shifts if needed, push through until closing right", "Close the operation for the day, notify all booked customers, offer to reschedule their visits for tomorrow", "Pull staff from other departments regardless of training, assign them support tasks, hope for the best right"],
    correct: 0
  },
  {
    type: "mc", id: 5,
    question: "A customer posts a 1-star review saying the experience was terrible and the on-duty manager didn't care. You weren't working that day. What do you do?",
    options: ["Respond publicly with an apology, investigate what happened internally, coach the team on service recovery", "Post a detailed reply clarifying you were off duty, explain the normal standards, invite them to return", "Flag the review for removal citing inaccuracy, document the request, follow up with the platform support", "Ignore the review, since the overall rating is strong, focus energy on generating new positive testimonials"],
    correct: 0
  },
  {
    type: "mc", id: 6,
    question: "Monthly financials show revenue hit target but net profit is 20% below budget. Labor cost is 35% vs a 28% target. What's the most effective fix?",
    options: ["Review staffing levels against peak vs slow traffic, adjust scheduling to actual demand, cross-train the team", "Reduce everyone's hours by twenty percent equally, monitor service quality impact, adjust again next month", "Raise menu prices by twenty percent across the board, track customer volume changes, revert if sales decline", "Terminate the highest-paid employees first, redistribute their duties, hire junior replacements at lower cost"],
    correct: 0
  },
  {
    type: "mc", id: 7,
    question: "Your location has been open 3 months. Weekday off-peak traffic is consistently 50% below target. What's your approach?",
    options: ["Wait another three months, since new locations always need time to build consistent regular customer traffic", "Create targeted off-peak promotions, partner with nearby businesses for cross-referrals, boost online presence", "Discount everything thirty percent every weekday, advertise heavily on social media, track conversion rates", "Reduce weekday staffing to cut losses, close the kitchen during slow hours, focus resources on peak periods"],
    correct: 1
  },
  {
    type: "mc", id: 8,
    question: "Two senior team members are in open conflict. It's hurting morale and service quality across the whole team. How do you resolve it?",
    options: ["Meet each person separately first, then facilitate a structured conversation with clear expectations set", "Ignore the situation entirely, let them resolve it themselves, intervene only if performance metrics drop", "Fire the person who initiated the conflict, document the cause, communicate the decision to the whole team", "Transfer one of them to another location immediately, backfill their role, brief the remaining team members"],
    correct: 0
  },
  {
    type: "mc", id: 9,
    question: "You discover a team member has been giving company products to friends without authorization. What do you do?",
    options: ["Investigate the scope of losses, issue a formal written warning, implement better tracking controls going forward", "Give them a verbal warning privately, document the conversation in their file, monitor their behavior closely right", "Terminate them immediately without further investigation, notify the team, update the company theft policy right", "Ignore the situation if amounts are small, avoid confrontation, focus your energy on larger business priorities"],
    correct: 0
  },
  {
    type: "mc", id: 10,
    question: "The owner asks you to increase revenue by 20% next quarter without adding headcount. What's your plan?",
    options: ["Increase average transaction value through add-ons, fill slow periods with promotions, reduce inventory waste", "Extend all shifts by two hours daily, push the existing team harder, monitor burnout indicators each week right", "Raise all menu prices by twenty percent immediately, notify customers of the value improvements being made", "Tell the owner the target is not achievable, present data showing current capacity limits, propose alternatives"],
    correct: 0
  },
  {
    type: "mc", id: 11,
    question: "Your waste rate is 8% of purchases vs an industry standard of 3-5%. What systematic changes would you implement?",
    options: ["Tell the team to be more careful with materials, post reminders in the kitchen, review waste monthly overall", "Implement daily waste tracking by category, adjust par levels to match sales data, schedule prep to demand", "Cut all inventory orders by fifty percent immediately, force the team to operate with less available stock", "Remove the highest-waste products from the offering entirely, replace them with lower-waste alternatives now"],
    correct: 1
  },
  {
    type: "mc", id: 12,
    question: "A regulatory inspector arrives unannounced. You have a few minor compliance issues you haven't fixed yet. What do you do?",
    options: ["Welcome them professionally, be transparent about known issues, take detailed notes plus create an action plan", "Blame the previous shift for all issues found, document their names, escalate responsibility to shift leads", "Request a postponement explaining it's not a convenient time, offer to schedule a follow-up visit next week", "Offer the inspector complimentary services, make small talk to build rapport, hope they overlook minor items"],
    correct: 0
  },
];

// MANAGER-LEVEL: Time Management (16 questions)
// Distribution target: A=4, B=4, C=4, D=4
export const TM_MGR: MCQuestion[] = [
  {
    type: "mc", id: 1,
    question: "It's 10 AM Monday. You have: inventory due by noon, a staff 1-on-1 at 11, a supplier meeting at 2 PM, event setup by 3 PM. A key team leader calls in sick. What gets your attention first?",
    options: ["Delegate inventory to a trusted senior, keep the one-on-one, brief the team on event setup responsibilities", "Postpone your entire schedule for the day, personally cover the absent team leader's floor responsibilities", "Cancel the one-on-one meeting to do inventory yourself, since that has the earliest hard deadline to meet", "Start on inventory immediately, since it is due soonest, figure out the rest of the day after it is done"],
    correct: 0
  },
  {
    type: "mc", id: 2,
    question: "You manage 15 people across two shifts. Three consistently underperform but not badly enough for formal discipline. How do you allocate management time?",
    options: ["Divide your coaching time equally among all fifteen staff members to maintain fairness across the board right", "Invest most coaching time in top performers for multiplier effect, set measurable targets for underperformers", "Concentrate all your energy on improving the three underperformers, until they reach minimum standard levels", "Ignore the underperformers entirely, focus on high-value activities, let natural attrition handle the rest"],
    correct: 1
  },
  {
    type: "mc", id: 3,
    question: "The owner asks you to: prepare a monthly report, implement a new product line, train staff on a new system, and improve satisfaction scores — all in 2 weeks. How do you prioritize?",
    options: ["Work on all four simultaneously, rotate between them daily, push hard on weekends to catch up on backlog right", "Sequence them strategically: system training first, product launch second, satisfaction third plus report last", "Ask the owner which single item matters most to them personally, focus all resources on that one entirely right", "Delegate all four to individual team leads, set checkpoints every three days, provide guidance as needed going"],
    correct: 1
  },
  {
    type: "mc", id: 4,
    question: "During a busy period you must handle: a VIP complaint, equipment malfunction, a large walk-in group, and an injured team member. What order?",
    options: ["VIP complaint first since they represent the highest-value relationship, then equipment, walk-ins, injury", "Equipment malfunction first since it affects all operations, then VIP, then walk-ins, then injury last", "Walk-in group first, since accommodating twelve new customers represents the largest revenue opportunity now", "Team member injury first for safety, delegate equipment repair, welcome the walk-ins, then handle the VIP"],
    correct: 3
  },
  {
    type: "mc", id: 5,
    question: "You spend 3 hours daily on admin tasks (scheduling, ordering, reporting) that keep you off the floor during peak. What's your approach?",
    options: ["Accept that admin work is simply part of the role, continue at current pace, adjust expectations for floor time", "Block admin time during off-peak hours, create reusable templates to cut admin in half, train someone on ordering", "Complete admin during peak periods, since the team should be capable of managing operations independently right", "Eliminate all administrative tasks from your role entirely, focus exclusively on floor presence every shift right"],
    correct: 1
  },
  {
    type: "mc", id: 6,
    question: "Your location is launching a new morning service next month. You need: 4 new hires, training, offering design, new procedures, and marketing. You have 4 weeks. How do you structure this?",
    options: ["Compress everything into the final week before launch, work overtime, rely on adrenaline to push through as the", "Hire all four people first then figure everything else out afterward, since staffing is the critical path as the", "Delay the launch indefinitely, until every single element is perfected, tested, and fully ready to execute right now", "Week 1: finalize offering plus start hiring. Week 2: complete hiring plus training. Week 3-4: test runs, soft launch"],
    correct: 3
  },
  {
    type: "mc", id: 7,
    question: "Weekly team meetings at 3 PM Monday have dropped to 60% attendance because staff say they're busy with evening prep. What do you do?",
    options: ["Enforce mandatory attendance with written warnings for anyone who misses, regardless of their stated reasons", "Cancel all team meetings permanently, since the current format is not working for the team's daily schedule", "Move the meeting to a non-conflicting time, shorten to fifteen minutes standing format, share written notes", "Hold meetings only when there is something critical enough to justify pulling the entire team from prep work"],
    correct: 2
  },
  {
    type: "mc", id: 8,
    question: "A private event for 50 guests is booked Saturday. Normal Saturday volume is 120. Your team can handle 140 total. How do you plan?",
    options: ["Hope regular traffic runs lower than usual, since the event absorbs capacity that walk-ins would otherwise fill", "Cancel all regular bookings for the day, dedicate the entire operation to making the private event a success right", "Run with current staffing, since one hundred seventy is close to one hundred forty, push through the evening right", "Call in extra staff, assign a dedicated event team, cap walk-in seating plus pre-prepare event items ahead of time"],
    correct: 3
  },
  {
    type: "mc", id: 9,
    question: "You must reduce labor cost from 35% to 28% of revenue over 3 months without cutting service quality. How do you approach this?",
    options: ["Cut hours aggressively starting next month to hit twenty-eight percent immediately, monitor quality weekly", "Month 1: analyze staffing vs actual demand, eliminate overtime. Month 2: flex scheduling. Month 3: fine-tune", "Distribute the reduction evenly at two point three percentage points per month across every single position", "Request a longer timeline from ownership, present data showing why three months is unrealistic for this goal"],
    correct: 1
  },
  {
    type: "mc", id: 10,
    question: "Operations wants to change 30% of offerings at once. Marketing needs 2 weeks for materials. Staff need training. Operations wants launch in 1 week. How do you manage?",
    options: ["Let operations launch immediately, since they understand the products better than marketing or training does", "Negotiate a phased rollout: ten percent in week one, next ten percent week three, final ten percent week five", "Delay everything, until marketing materials are completely ready, even if operations must wait several weeks", "Launch all thirty percent in one week as operations requests, handle marketing and training retroactively right"],
    correct: 1
  },
  {
    type: "mc", id: 11,
    question: "Your daily revenue report at 11 PM shows numbers 40% below target. Tomorrow is also predicted to be slow. What actions do you take?",
    options: ["Take no special action, since one bad day is not statistically significant enough to warrant a response right", "Send an urgent message to the team highlighting the poor numbers, demand explanations from every supervisor", "Tonight: check for external factors affecting traffic. Tomorrow: review bookings, push a promotion, brief team", "Discount the entire offering by forty percent tomorrow to compensate for today's shortfall in revenue total"],
    correct: 2
  },
  {
    type: "mc", id: 12,
    question: "End of month in 3 days. Still need: 15 performance reviews, next month's schedule, inventory count, close financials. What's your approach?",
    options: ["Work sixteen-hour days yourself, handle every task personally without delegation, push through the weekend as the", "Day 1: inventory plus delegate schedule. Day 2: schedule plus eight reviews. Day 3: remaining reviews plus financials", "Request a deadline extension on all deliverables, present a case that three days is insufficient for everything right", "Skip all performance reviews entirely, since they are the least time-sensitive item on the list this month as the"],
    correct: 1
  },
  {
    type: "mc", id: 13,
    question: "Two department leads both need you at 2 PM — one for a staffing issue, the other for a product review. How do you handle it?",
    options: ["Choose the product review, since product quality drives revenue directly, reschedule the staffing discussion", "Choose the staffing issue, since people problems always take priority over product concerns in every case", "Assess the urgency of each situation: if the staffing matter is time-sensitive, handle it first this time", "Cancel both meetings entirely, handle them tomorrow morning when you have more time to give each attention"],
    correct: 2
  },
  {
    type: "mc", id: 14,
    question: "Your operation opens at 11 AM. Morning routine: review reports, brief team, verify prep, inspect cleanliness, check bookings, respond to messages. You arrive at 9 AM. How do you use 2 hours?",
    options: ["Complete tasks in whatever order feels natural, hope you finish everything before the doors open at eleven right", "Start with the team briefing at nine so staff begin their preparation tasks as early as possible today as the", "9-9:30: reports plus messages. 9:30-10: floor walk. 10-10:30: bookings plus briefing. 10:30-11: buffer for issues", "Focus exclusively on the single most urgent item on the list, skip everything else due to time pressure right now"],
    correct: 2
  },
  {
    type: "mc", id: 15,
    question: "You've been promoted to manage a second location alongside your current one. How do you divide your time?",
    options: ["Split time exactly fifty-fifty between both locations to ensure neither team feels neglected or secondary right", "Spend all your time at the new location, let the established one operate independently with current staff right", "Identify which location needs more attention, spend more time there initially, develop strong leaders at both", "Alternate between locations on a strict daily rotation every week, without deviation from the fixed schedule"],
    correct: 2
  },
  {
    type: "mc", id: 16,
    question: "Team is burned out after 3 weeks at 120% capacity. Quality is dropping, 2 staff threaten to quit. Next peak is in 2 weeks. How do you manage energy?",
    options: ["Push through the next two weeks regardless, rally the team around collective resilience, promise rest later", "Let the two staff resign now, begin recruitment immediately, onboard replacements before the next peak period", "Lighten this week's schedule, recognize effort with a meaningful reward, plan ahead by hiring temporary staff", "Close the operation for several days to give everyone complete rest before the upcoming busy period begins"],
    correct: 2
  },
];

// MANAGER-LEVEL: Communication (15 questions)
// Distribution target: A=4, B=4, C=3, D=4
export const COMM_MGR: MCQuestion[] = [
  {
    type: "mc", id: 1,
    question: "You need to tell your team that year-end bonuses are cut 50% due to lower profits. How do you communicate this?",
    options: ["Send a group message with the news, include the business context, let everyone process individually at home right now", "Have HR send the announcement officially, so the communication comes from a formal corporate channel instead right", "Wait, until staff ask about bonuses to share the news, avoid proactively creating anxiety across the team as the", "Hold a team meeting, present the business situation transparently, acknowledge disappointment plus outline next steps"],
    correct: 3
  },
  {
    type: "mc", id: 2,
    question: "A VIP client is furious that their booking was lost — they waited 30 minutes. They demand the manager. How do you handle this?",
    options: ["Explain the system likely had a technical error, acknowledge the inconvenience, describe the fix implemented", "Offer a fifty percent discount immediately before they ask, apologize repeatedly, promise it won't happen again", "Apologize sincerely without excuses, acknowledge their time is valuable, offer to make it right immediately", "Direct the front-line team to handle it with authority, since booking management is within their responsibilities"],
    correct: 2
  },
  {
    type: "mc", id: 3,
    question: "The owner asks for a monthly performance update. What format and content do you present?",
    options: ["Send a comprehensive email with every data point available, so the owner has complete information on file right", "Update the owner verbally during a casual encounter, keep it conversational, follow up in writing afterward right", "Send the raw financial spreadsheet with a brief cover note letting the owner draw their own conclusions right", "Prepare a one-page summary: key metrics versus targets, top wins, main challenges with solutions plus priorities"],
    correct: 3
  },
  {
    type: "mc", id: 4,
    question: "Two department leads blame each other for slow service times. One says requests arrive late; the other says processing is too slow. How do you mediate?",
    options: ["Side with the lead whose version aligns with your personal observations, direct the other to change first", "Tell both leads to resolve it themselves, set a deadline for resolution, follow up only if nothing changes", "Redesign the entire workflow from scratch without consulting either lead, implement the new system next week", "Pull system data first to establish facts, then bring both leads together to identify the actual bottleneck"],
    correct: 3
  },
  {
    type: "mc", id: 5,
    question: "You need to terminate a consistently underperforming team member despite 3 formal warnings. They've been here 2 years and are well-liked. How do you handle it?",
    options: ["Do it quickly over the phone after business hours to minimize disruption, send written confirmation afterward", "Have HR conduct the conversation alone, so the message comes from an official function, rather than from you", "Meet privately, be direct but compassionate, reference the documented warnings plus plan how to inform the team", "Gradually reduce their hours each week, until they choose to leave voluntarily, without a formal termination"],
    correct: 2
  },
  {
    type: "mc", id: 6,
    question: "Your location is implementing a major technology change. Half the team resists the new system. How do you communicate and drive adoption?",
    options: ["Mandate immediate adoption with disciplinary consequences, set a hard deadline, monitor compliance strictly", "Allow resistant staff to keep using old methods permanently, accept that some people will never adapt to tech", "Install the new system overnight, without notice, disable the old one, force everyone to adapt the next morning", "Explain the rationale clearly, involve the team in setup, run systems in parallel briefly, coach individually"],
    correct: 3
  },
  {
    type: "mc", id: 7,
    question: "An influential reviewer with a large following DMs your business account about a bad experience before posting publicly. What do you do?",
    options: ["Ignore the message entirely, since responding gives individual reviewers disproportionate power over you now", "Reply promptly with a personal apology, ask for specific details to fix the issue, invite them to return", "Offer monetary compensation specifically to prevent them from posting their negative review in public online", "Respond defensively with a detailed explanation of why their experience was not representative of normal here"],
    correct: 1
  },
  {
    type: "mc", id: 8,
    question: "You're running a 10-minute pre-shift briefing. Topics: new promotion, VIP booking tonight, standards reminder, positive feedback from yesterday. How do you structure it?",
    options: ["Read through all four points as rapidly as possible to pack everything into the limited time slot available right", "Start with yesterday's positive feedback for energy, then VIP details, then promotion plus close with standards", "Cover only the VIP booking, since it is the most operationally critical item for tonight's specific service right", "Send all information via group chat instead of meeting in person, since that format is more time-efficient right"],
    correct: 1
  },
  {
    type: "mc", id: 9,
    question: "A team member privately reports that another colleague has been making inappropriate comments. How do you handle this?",
    options: ["Tell the reporter to confront the person directly, provide coaching on how to have that conversation well right", "Immediately confront the accused person in front of the team as a visible warning about workplace standards right", "Thank them for the trust, document the complaint, investigate discreetly, take appropriate action plus follow up", "Dismiss the complaint, unless there is hard physical evidence, since it is one person's word against another right"],
    correct: 2
  },
  {
    type: "mc", id: 10,
    question: "A supply error means your signature product is unavailable tonight. 15 customers have specifically pre-ordered it. How do you communicate?",
    options: ["Tell each customer it is sold out when they arrive, offer the closest available alternative on the menu right", "Substitute a different ingredient, without informing customers, instruct the team to present it as standard right", "Blame the supplier openly when customers ask so they understand the situation is outside of team control right", "Contact all fifteen customers proactively before they arrive, apologize, recommend alternatives plus offer extra"],
    correct: 3
  },
  {
    type: "mc", id: 11,
    question: "You want to propose a Rp 150M renovation to the owner, projecting a 40% revenue increase. How do you present this?",
    options: ["Tell the owner the space needs an upgrade, request budget approval, leave the detailed planning for later right", "Build a brief proposal: current revenue data, projected increase with rationale, detailed cost breakdown plus ROI", "Wait, until the owner mentions renovations first, then share your prepared ideas when the timing is natural right", "Start making small changes, without formal approval to demonstrate the concept, then request full budget later"],
    correct: 1
  },
  {
    type: "mc", id: 12,
    question: "During service, you hear a team member give completely wrong safety information about a product to a customer who has already ordered. What do you do?",
    options: ["Correct the team member after service ends, so the current operational flow is not disrupted by an intervention", "Let it go, since the production team knows the correct specifications for the product being prepared anyway", "Correct the team member loudly at the table, so the customer sees that you take safety information seriously", "Approach the customer discreetly, provide accurate safety details, offer to adjust the order if they prefer"],
    correct: 3
  },
  {
    type: "mc", id: 13,
    question: "Presenting quarterly results: revenue up 10%, profit down 5% due to higher costs. How do you frame this?",
    options: ["Focus exclusively on the positive revenue growth, minimize discussion of the profit decline during the meeting right", "Blame external factors like inflation or increased competition for the decline, redirect focus to next quarter right", "Present both figures transparently, explain the cost drivers, show corrective actions taken plus share recovery plan", "Downplay the profit decline quickly, pivot the conversation to upcoming opportunities and strategic initiatives right"],
    correct: 2
  },
  {
    type: "mc", id: 14,
    question: "New company policy requires digital scheduling, leave, and communication. Some team members struggle with the technology. How do you ensure adoption?",
    options: ["Tell struggling staff to learn it or face consequences, provide no additional support beyond the user manual right", "Create permanent exceptions for struggling staff to continue with the manual system alongside the digital one", "Communicate exclusively through the new platform, let struggling staff figure it out through trial and error right", "Run small-group training sessions, pair tech-savvy staff as mentors, keep old system briefly plus provide guides"],
    correct: 3
  },
  {
    type: "mc", id: 15,
    question: "Your team just had the location's best month ever — record revenue and highest satisfaction scores. How do you communicate this?",
    options: ["Send a quick congratulations in the group chat, immediately pivot to next month's goals, without celebration", "Skip any celebration, since focusing on past success creates complacency that undermines future performance", "Celebrate publicly with specific numbers, recognize individual contributions, organize a small team gathering", "Take personal credit when reporting upward, since your leadership decisions were the primary driver of success"],
    correct: 2
  },
];
