# 🎯 UPWORK PRIORITY BIDS: STRATEGY & ACTION PLAN
> **Created:** October 12, 2026 | **Target Execution:** Tomorrow Morning  
> **Status:** High Priority | Ready for Submission

---

## 📌 QUICK ACTION CHECKLIST (TOMORROW MORNING)
- [ ] **Step 1: Connects:** Purchase starter pack (50 Connects = $7.50 USD or 100 Connects = $15.00 USD).
- [ ] **Step 2: ID Badge (Optional):** Complete quick ID photo + selfie if choosing early verification (35 Connects).
- [ ] **Step 3: Job 1 Submission:** Copy-paste the Zurich proposal & answer the 3 screening questions (27 Connects).
- [ ] **Step 4: Job 2 Submission:** Submit the London B2B Scheduling proposal with the 1-Page Architecture Plan (20 Connects).

---

## 🏆 TARGET JOB 1: Senior Product Designer (AI-Native, Mobile + Web)

### 📊 Client & Job Intel
- **Client Location:** Zurich, Switzerland (Overlap required: 4 hours with CET)
- **Client Reputation:** 5.0 Rating (25 reviews) | **$175K Total Spent** | 83% Hire Rate
- **Budget / Rate:** **$50.00 – $90.00 / hr** (Recommended Bid: **$85.00 / hr**)
- **Scope:** Paid pilot sprint (5 days), followed by full 4–6 week app redesign sprint (30+ hrs/week).
- **Required Connects:** 27 Connects
- **Core Requirement:** AI in the design/build workflow is mandatory (Claude, Cursor, custom AI tooling) producing dev-ready components, tokens, or clean HTML/CSS.

---

### ✍️ COPY-PASTE SCREENING QUESTION ANSWERS (JOB 1)

#### Question 1:
> *"Describe your AI-assisted workflow in concrete terms: which tools, at which step, and how long a component set like the card above takes you from brief to dev-ready. Link an example you produced that way if you can."*

**Your Answer:**
```text
My workflow leverages an agentic AI-native IDE loop (Claude Code / Anthropic API / Antigravity IDE) coupled directly with Next.js, TypeScript, and Tailwind CSS design tokens.

Instead of drawing flat shapes in Figma and tossing static specs over the wall, I prototype and refine interactive components directly in code:
1. Concept & Token Definition (20 mins): Define design tokens (color variables, glassmorphism blur layers, typography scale, responsive breakpoints).
2. Code Prototyping (45 mins): Scaffold interactive component states (idle, hover, active, touch-listeners for iOS Safari) with kinetic physics.
3. Dev-Ready Polish (30 mins): Extract clean CSS variables and guarantee 100% type safety and dynamic props.

Total turnaround: ~2 hours from initial brief to dev-ready, production-grade code. 
Live example: The 5-card responsive glassmorphic pricing architecture live on https://autobathmelbourne.com/showcase
```

---

#### Question 2:
> *"Link your portfolio and point us to one shipped mobile or web product in it that you designed end to end. Name one thing you would change about it today."*

**Your Answer:**
```text
Portfolio: https://autobathmelbourne.com (Technical architecture showcase at https://autobathmelbourne.com/showcase).

I designed and engineered this entire automotive booking platform end-to-end—from the dark luxury visual system and 3D Three.js WebGL model to the full-stack Supabase scheduling backend.

One thing I would change today:
While the current mobile experience uses lightweight SVG displacement filters for touch ripples, on lower-tier Android GPUs, SVG filter repaints can occasionally drop frames. I would refactor those liquid touch micro-interactions to pure WebGL fragment shaders with an offscreen canvas to guarantee a locked 60fps across 100% of mobile hardware.
```

---

#### Question 3:
> *"Your availability over the next four weeks, and your rate for a fixed-scope first project of up to five days."*

**Your Answer:**
```text
Availability: 30+ hours/week with immediate availability for the concept day within the next 48 hours. Timezone overlap with Zurich (CET) is seamless (+1 hour).

Rate: $85.00/hr, or a fixed pilot sprint of $2,800 for the 5-day initial scope.
```

---

## 🏆 TARGET JOB 2: B2B Event Meeting-Scheduling Web App

### 📊 Client & Job Intel
- **Client Location:** London, United Kingdom (DEM Media Company)
- **Client Reputation:** 5.0 Rating | 18 Jobs Posted | $2.2K Spent | Good working relationship history
- **Budget:** **$3,000.00 Fixed-Price** (Phase 1 to 3)
- **Timeline:** Start November 2026, Live & Tested by February 2027
- **Required Connects:** 20 Connects
- **The Problem They Have:** 
  They organize international summits where buyers and sponsors have 1-on-1 meetings. Currently done manually with Typeform, spreadsheets, and manual calendar tools. It’s slow, error-prone, and hard to reschedule on event day.

---

### 🏗️ PROJECT PHASES BREAKDOWN
1. **Phase 1: Meeting Scheduling Engine (The Core Admin Tool):**
   - Event setup: Days, hours, meeting lengths, blackout keynote times.
   - Participant lists upload: Sponsors & buyers.
   - Typeform Webhook Ingestion: Preferences & rankings automatically sync into PostgreSQL.
   - Automated Timetable Engine: Generates full meeting timetable obeying sponsor contracted quotas & priorities.
   - Admin Manual Override: Drag/reschedule with automatic rule-breaking validation (blocks invalid slots).
   - Live Event Mode: Handle no-shows, instant rescheduling, PDF/report export.
2. **Phase 2: Personal Schedule View:**
   - Sponsor/buyer magic-link / secure login (view-only).
   - Download personalized schedule PDF.
   - Automated email notification (Resend) if timetable changes.
3. **Phase 3: Single Login Portal:**
   - Unified portal for preference submission + final timetable viewing.

---

### ✍️ PROPOSAL COVER LETTER & 1-PAGE IMPLEMENTATION PLAN (JOB 2)

**Your Proposal Cover Letter:**
```text
Hi DEM Team,

I reviewed your Event App Brief and Meeting Scheduling Rules documents in detail. Replacing spreadsheet/Typeform friction with an automated, rule-enforced timetable engine is an architectural problem I specialize in.

I recently engineered an automated multi-slot scheduling and dispatch engine (Next.js 16, Supabase PostgreSQL, Stripe, and transactional Resend notifications) live in production at https://autobathmelbourne.com.

Below is the concrete 1-page implementation plan for Phases 1 to 3:

1. ARCHITECTURAL & SCHEDULING ENGINE APPROACH:
• Constraint Satisfaction Engine: We will build a deterministic greedy/backtracking scheduling algorithm in TypeScript. The engine processes meetings by contract priority tiers (Tier 1 sponsor quotas first, followed by mutual rankings, buyer availability, and keynote blackout slots).
• Rule-Enforced Manual Adjustments: If an organizer manually drags or reassigns a meeting, the engine validates the slot in real time and blocks any change that creates double-bookings or violates contracted minimums.
• Live Event No-Show Handling: Organizers can flag a no-show with a single click, instantly freeing up the slot and triggering candidate recommendations.

2. TECH STACK (UK/EU COMPLIANT):
• Frontend: Next.js 16 (App Router, Tailwind CSS, Lucide icons, responsive admin interface).
• Backend & API: Next.js Server Actions with strict Zod validation.
• Database: Supabase PostgreSQL hosted in AWS London (eu-west-2) or Frankfurt (eu-central-1) for strict GDPR compliance.
• Integrations: Typeform Webhook API (auto-syncing participant preferences), Resend API for instant timetable update alerts, and React-PDF for client schedule downloads.

3. MILESTONES & TIMELINE:
• Phase 1 (Weeks 1–4 | $1,500): Core event setup, Typeform ingestion, scheduling constraint engine, admin timetable review, manual override validation, and CSV/PDF export. Weekly live staging demos.
• Phase 2 (Weeks 5–6 | $800): Participant view-only portal, personalized PDF schedule downloads, and automated change-alert emails.
• Phase 3 (Weeks 7–8 | $700): Unified authentication portal for preference submission + schedule viewing, stress testing, and final deployment.

4. AI-ASSISTED DEVELOPMENT & CODE AUDIT:
I use agentic AI tools (Claude Code / Antigravity IDE) to rapidly scaffold boilerplate, database migrations, and unit tests. Every single algorithm rule, edge case (e.g. tie-breaking preferences, simultaneous room limits), and data migration is manually verified with comprehensive automated test suites (Jest/Vitest).

Available to start immediately with weekly demo milestones. Looking forward to discussing the scheduling logic document with your team.

Best regards,
Sherif Seif
Lead Full-Stack Architect | Globe Vista Hub
Portfolio: https://autobathmelbourne.com (Case study: /showcase)
```

---

## 📁 RELEVANT ARTIFACTS & LINKS
- **Auto-Bath Live SaaS:** `https://autobathmelbourne.com`
- **Auto-Bath Technical Case Study:** `https://autobathmelbourne.com/showcase`
- **Good Brains AI Studio:** `https://www.goodbrains.pro`
- **Handover Markdown:** `UPWORK_PORTFOLIO_HANDOVER.md`
