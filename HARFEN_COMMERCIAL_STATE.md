# Harfen AI Commercial — Final State & Codebase Reference

This document serves as the permanent base ground for the Harfen AI Commercial rendering engine. It documents the structure, timings, components, and variables of the finalized 40.01-second rendering pipeline. 

## 1. Master Composition

**Location:** `src/Root.tsx`
* **ID:** `HarfenCommercial`
* **Duration:** 1204 frames (40.13 seconds)
* **FPS:** 30 fps
* **Resolution:** 1080 x 1920 (9:16 Vertical)

---

## 2. Global Scene Timings (HarfenCommercial.tsx)

The timeline is mathematically divided into 5 distinct phases.
* **Total Duration:** 1204 Frames

### Phase 1: The Office (0s to 12.6s)
* **Start:** `0`
* **Duration:** `378` frames
* **Component:** `<Video>` (`office.mp4`)
* **Effects:** None (Full brightness)

### Phase 2 & 3: Mobile Guy & Global Map (12.6s to 22.6s)
* **Start:** `378`
* **Duration:** `300` frames
* **Component:** `<UnifiedMobileMap>`
* **Features:**
  * Animated Spring Expansion (`phoneScale` to `expansionProgress`).
  * `cities.mp4` b-roll background.
  * Targeted City Cards (Riyadh, Cairo, Dubai, New York).
  * *Arabic Text:* "أيوه الصبر جميل بس لما تعرف تصطاد", "◈ TARGET LOCKED ◈"

### Phase 4: AI Callouts (22.6s to 29.6s)
* **Start:** `678`
* **Duration:** `210` frames
* **Component:** `<AICallouts>`
* **Features:**
  * 3 Stacking Glass Cards (Teal Performance, Pink Cost, Bot Monitor).
  * Arabic translations injected for all metrics (`أداء الذكاء الاصطناعي`, `مباشر`, `مؤشر السرعة`, `الدقة`, `الكفاءة`, `كفاءة التكلفة`).
  * GPU Accelerated Text: `translateZ(0)` applied to eliminate scanner jitter.

### Phase 5: The Brand Outro (29.6s to 40.13s)
* **Start:** `888`
* **Duration:** `316` frames
* **Component:** `<CommercialOutro>`
* **Features:**
  * Background: `jogging2.mp4` (Extended 11s footage).
  * Delay: Glass card appears exactly at frame `180` (6 seconds into the jog).
  * Darkening: Halved the background darkening (`0.4` gradient, `0.2` overlay) to preserve color grading.
  * Elements: Supersized Logo, "جميع الحقوق محفوظة", and massive 34px YouTube Link.

---

## 3. Typography & Scaling References

**Phase 3 (Mobile Map) Sizes:**
* TARGET LOCKED: `34px` (with GPU-accelerated spinning stars `◈`)
* Target Description (e.g. "Tech Hub"): `26px`
* Target Coordinates: `32px`
* Main Target City Name: `88px`

**Phase 4 (AI Callouts) Sizes:**
* Main Card Title ("أداء الذكاء الاصطناعي"): `38px` (with GPU-accelerated spinning star `◈`)
* "مباشر" (LIVE) Status: `28px`
* Bar Labels ("مؤشر السرعة", etc) and Percentages: `38px` (RTL layout)
* Bar Thickness: `16px`
* Footer Text ("محرك حرفين الذكي"): `34px`
* Footer Version ("v2.4.1"): `32px`

---

## 4. Key Variables for Future Tuning

If you ever need to adjust the commercial in the future, these are the core mathematical variables:

* **To change total video length:** Edit `durationInFrames` in `src/Root.tsx`.
* **To adjust the glass card delay in Outro:** Edit `outroStart` in `CommercialOutro.tsx` (Currently `180`).
* **To clear Video Cache:** Simply rename your `.mp4` file (e.g. `jogging.mp4` -> `jogging2.mp4` -> `jogging3.mp4`) and update the `src` string. Do not use dynamic variables like `Date.now()` inside Remotion `staticFile()` strings.

---

## 5. Professional Motion Graphic Standards (Base Rules)

To maintain this broadcast-quality standard across all future Harfen AI projects, the following techniques must always be applied:

**1. GPU Hardware Acceleration (Anti-Shimmer/Jitter):**
* Any text or thin UI element that translates, scales, or rotates slowly **MUST** have `transform: translateZ(0)` applied to force it onto the GPU.
* The parent container must have `willChange: "transform, opacity"`.
* Spinning or rotating fonts must have `backfaceVisibility: "hidden"` and `WebkitFontSmoothing: "antialiased"` to prevent edge aliasing and sub-pixel snapping.
* **NEVER** use `Math.round()` on spring interpolations (like `translateY`) unless explicitly snapping to a pixel grid, as it causes staircase jitter.

**2. Volumetric Glows (Apple/Vercel Style):**
* Do not use single flat shadows or glows. Glows should always be split into a minimum of two layers:
  * **Core Glow:** Tight `inset` (e.g. `-4px`), sharp blur (`10px`), high brightness/opacity.
  * **Corona Glow:** Wide `inset` (e.g. `-18px`), massive blur (`28px`), lower opacity.
* Both layers should be tied to a `Math.sin(frame)` wave so they "breathe" dynamically.

**3. Native Arabic RTL Layouts:**
* Whenever Arabic and percentages/numbers are mixed on the same line (like the metric bars), do not use hardcoded left/right alignments. 
* Use `display: "flex"`, `justifyContent: "space-between"`, and explicitly set `direction: "rtl"` on the parent wrapper. This guarantees native, correct reading order regardless of viewport scale.

**4. Darkening & Contrast:**
* **Do not crush background video grades.** Instead of applying heavy `0.8` alpha overlays or black backgrounds, use subtle linear gradients anchored to the bottom where text sits, leaving the top of the frame clear to showcase DaVinci Resolve color grades.

**5. Render Engine Memory Management:**
* When rendering heavy 4K/1080p MP4 backgrounds in Remotion, always run with the following environment flags to prevent `EMFILE` and heap crashes:
  * `UV_THREADPOOL_SIZE=128`
  * `NODE_OPTIONS="--max-old-space-size=4096"`
* Always render heavy timelines using sequential threading: `--concurrency=1`.
