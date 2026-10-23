# Motion Graphics Blueprint: The Timeline Sync Sheet

## Instructions for Editor
This document serves as the exact timeline sync sheet for the horizontal edit. Match these UI Graphics and Arabic tags to the exact timecodes below.
**Mograph Sync Rule:** Ensure the UI boxes physically interact with the camera cuts/movements at the exact frame markers indicated.

---

## 🎨 Color & Style Specification (Standalone — Matched to Cinematic Footage)

> These values are derived from the commercial's own cinematic palette, **not** the Harfen W Laken or GoodBrains brand systems. The UI must feel native to the footage world.

### Typography
| Property | Value |
|---|---|
| **Arabic Font** | `Tajawal Black` (weight 900) via Google Fonts |
| **English Tag Font** | `JetBrains Mono` or `Courier New` (monospace, uppercase only) |
| **Arabic Text Size** | `64–72px` at 1920×1080 |
| **Tag Text Size** | `28px` — always inside the UI box, left-aligned |
| **Line Height** | `1.2` — tight, punchy |

### UI Box (Glassmorphic System Notification)
| Property | Value |
|---|---|
| **Shape** | Rounded rectangle, `border-radius: 12px` |
| **Background** | `rgba(5, 5, 10, 0.65)` — near-black, semi-transparent |
| **Blur** | `backdrop-filter: blur(18px)` |
| **Border Width** | `2px solid` — color changes per Act (see below) |
| **Padding** | `16px 24px` |
| **Position** | Center-screen, slightly above midline |

---

### 🔴 Act 1 — The Nightmare (Error State)
*Footage tone: desaturated, cold grey, chaotic handheld*

| Element | Value |
|---|---|
| **Border Color** | `#FF3B30` — hard alert red |
| **Icon Glow** | `text-shadow: 0 0 20px rgba(255, 59, 48, 0.9)` |
| **Text Color** | `#FFFFFF` |
| **Tag Color** | `#FF3B30` |
| **Animation** | Snap-in with `scale(1.08)` overshoot → settle. Glitch/chromatic aberration on entry frame. |
| **Exit** | Motion-blurs off-screen direction matching camera whip-pan. |

---

### 🔵 Act 2 — The Pivot (Scanning / Transition State)
*Footage tone: cyber-teal laser wash, warehouse industrial*

| Element | Value |
|---|---|
| **Border Color** | `#00C2D4` — cyber teal, matching the practical laser in frame |
| **Icon Glow** | `text-shadow: 0 0 30px rgba(0, 194, 212, 0.85)` |
| **Text Color** | `#E0FEFF` — near white with a cool tint |
| **Tag Color** | `#00C2D4` |
| **Transition** | Old red boxes shatter off-screen as the laser sweeps L→R at `00:36`. Teal boxes slide in from the RIGHT, following the laser direction. |
| **Animation** | Smooth ease-in. No glitch — this is the calm after the storm. |

---

### 🟢 Act 3 — Ahead of the Curve (Automated / Success State)
*Footage tone: warm sunrise, golden hour, natural light*

| Element | Value |
|---|---|
| **Border Color** | `#0C7735` — GoodBrains brand green (ties the visual payoff to the product) |
| **Icon Glow** | `text-shadow: 0 0 20px rgba(12, 119, 53, 0.7)` |
| **Text Color** | `#FFFFFF` |
| **Tag Color** | `#34D058` — lighter green for the tag text |
| **Animation** | Soft fade-in (`opacity 0 → 1` over 12 frames). No snap, no glitch. Polite and confident. |
| **Position** | Shifts to lower-left or lower-right corner — less dominant, because the LIFE on screen is now the hero, not the UI. |

---

### ⚡ Micro-Animation Rules (Global)
| Event | Action |
|---|---|
| **Camera Snap-Zoom** | UI box snaps in simultaneously at same frame (`scale 0.5 → 1.0` in 3 frames) |
| **Camera Whip-Pan** | UI box motion-blurs and exits in the pan direction (add `motion-blur: 180°` at `00:03`) |
| **Hard Cut** | UI box can hard-cut with the edit OR persist across cut at 70% opacity |
| **Slow-Motion Scene** | UI box matches the speed-ramp — slows down with the footage |
| **Act 1 → Act 2 Pivot** | At `00:36` on laser hit: red box **shatters** (horizontal split, pieces fall), teal box rises in |

---

---

## 🎬 Act 1: The Nightmare (Red / Orange UI - Errors & Lag)

### [ 00:00 - 00:04 ] Scene 1: The Morning Blur
* **The Visual:** Snap-zoom on his face in bed, whip-pan to the kitchen.
* **Mograph Sync:** UI box snaps in on `00:00`. It motion-blurs violently off-screen at `00:03` with the whip-pan.
* **UI Graphic:** `[ ⏳ جاري التحميل... فشل ]` (Loading... Failed)
* **Arabic Caption:** `بتصحى وتكتشف إن اليوم سابقك.`

### [ 00:05 - 00:09 ] Scene 2: The Traffic Tease
* **The Visual:** Gridlocked traffic.
* **Mograph Sync:** UI box hovers above the dashboard, vibrating with a heat-wave distortion effect. 
* **UI Graphic:** `[ ⚠️ تحذير: تكدس المهام ]` (Warning: Task Overload)
* **Arabic Caption:** `بتستفز بسبب و من غير سبب...`

### [ 00:10 - 00:13 ] Scene 3: The Elevator Trap
* **The Visual:** Rushing into the elevator, doors slamming.
* **Mograph Sync:** The UI box violently "shatters" horizontally exactly on the frame where the elevator doors slam shut.
* **UI Graphic:** `[ 🔒 تم رفض الوصول ]` (Access Denied)
* **Arabic Caption:** `...وأبواب بتتقفل في وشك.`

### [ 00:14 - 00:17 ] Scene 4: The Office Blow
* **The Visual:** Slow-motion phone thrown at him by the client.
* **Mograph Sync:** The UI box acts as an AR tracking tag, floating next to the flying phone in 3D space, matching the exact slow-motion speed ramp.
* **UI Graphic:** `[ 🔄❌ فشل مزامنة العميل ]` (Client Sync Failed)
* **Arabic Caption:** `ولما العميل يراجعك.. بتحس فعلياً إنه عايز يخبطك.`

### [ 00:18 - 00:23 ] Scene 5: The Guilt Anchor
* **The Visual:** Close-up of the phone message on the table.
* **Mograph Sync:** The UI box acts as a critical alert overlapping the physical phone screen.
* **UI Graphic:** `[ 🚨 خطأ فادح: خلل في التوازن ]` (Critical Error: Imbalance)
* **Arabic Caption:** `والقريبين منك.. هم اللى بيدفعوا التمن.`

### [ 00:24 - 00:33 ] Scene 6 & 7: The Escape Attempt
* **The Visual:** Sitting in front of TV, then jogging in the rain until exhausted.
* **Mograph Sync:** A battery icon UI anchors to his chest. As he stops running at `00:31`, the battery drains to zero and flashes red.
* **UI Graphic:** `[ 🪫 طاقة النظام: ٠٪ ]` (System Energy: 0%)
* **Arabic Caption:** `بتحاول تجري وتلحق.. بس بتنهج ومفيش فايدة.`

---

## 🎬 Act 2: The Pivot (Cyber-Teal UI - The Solution)

### [ 00:34 - 00:42 ] Scene 8: The GoodBrains Fix
* **The Visual:** The warehouse laser sweep optimizing the messy files.
* **Mograph Sync:** As the physical laser sweeps across the screen at `00:36`, it "washes" away the red error graphics. In its wake, it leaves behind clean, glowing teal UI boxes tracking the flying files.
* **UI Graphic:** `[ 🔍 جاري فحص النظام... ]` (Scanning System...)
* **Arabic Caption:** `أكيد فى مشكلة فى الشغل.. فى السيستم.. ملخبط إيقاع حياتك.`

---

## 🎬 Act 3: Ahead of the Curve (Clean Green UI - Automated Life)

### [ 00:43 - 00:45 ] Scene 9: The New Morning
* **The Visual:** Making breakfast for the happy family.
* **Mograph Sync:** The UI sits politely in the corner, glowing soft green.
* **UI Graphic:** `[ ✅ تم تحسين مسارات العمل ]` (Workflows Optimized)
* **Arabic Caption:** `ارجع اتحكم تاني فى وقتك.`

### [ 00:46 - 00:51 ] Scene 10: The Traffic Revenge
* **The Visual:** Driving calmly in the car, passing the speeding teenagers.
* **Mograph Sync:** UI tracks smoothly on the car window.
* **UI Graphic:** `[ ⏩ المسار الآلي نشط ]` (Automated Route Active)
* **Arabic Caption:** `وفوّت الفرصة على اللى يأخرك، هتكون دايماً سابق بخطوة.`

### [ 00:52 - 00:55 ] Scene 11: Elevator Boss
* **The Visual:** Standing calmly alone in the elevator.
* **Mograph Sync:** UI appears softly as the doors open.
* **UI Graphic:** `[ 🔓 تم استعادة التحكم ]` (Control Restored)
* **Arabic Caption:** `الزحمة تختفي.`

### [ 00:56 - 01:00 ] Scene 12: Piano Recital
* **The Visual:** Clapping at the daughter's piano recital.
* **Mograph Sync:** UI fades in subtly near the stage.
* **UI Graphic:** `[ 📅 تم تحرير الجدول ]` (Schedule Freed)
* **Arabic Caption:** `وتكون حاضر في اللحظات اللي بجد بتفرق...`

### [ 01:01 - 01:03 ] Scene 13: Silent UI Metaphor
* **The Visual:** Close-up on the smartwatch showing the GoodBrains stats.
* **Mograph Sync:** The smartwatch screen itself glows. No external floating boxes needed.
* **UI Graphic:** `[ ⚙️ المهام في الخلفية: مكتملة ]` (Background Tasks: Completed)
* **Arabic Caption:** `السيستم شغال في الخلفية بيلملم كل حاجة وراك.`

### [ 01:04 - 01:09 ] Scene 14: Outro
* **The Visual:** GoodBrains.pro title card ("STOP LAGGING / START LIVING").
* **Mograph Sync:** A clean, glowing checkmark locks in beneath the logo.
* **UI Graphic:** `[ 🌐 تمت المزامنة بنجاح ]` (Successfully Synced)
* **Arabic Caption:** `Never miss out on the actual show... GoodBrains.pro.`
