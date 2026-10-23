# Harfen W Laken — Episode 1: Locked Design System

> **Source of Truth** for all visual components, timings, and styles.
> Use this document when building the **second half of Episode 1** to maintain 100% visual consistency.

---

## ⚙️ Composition Config
| Property | Value |
|---|---|
| **Composition ID** | `HarfenEpisode1` |
| **FPS** | `30` |
| **Resolution** | `1920 × 1080` |
| **Total Frames** | `3200` (~1m 46s) |
| **Master Video** | `public/youtube-assets/episode-1-master.mp4` |
| **Font** | `Tajawal` (Arabic) via Google Fonts |

---

## 🎨 Design Tokens (Brand Colors)
| Role | Color |
|---|---|
| **Primary Pink** | `#ec4899` / `rgba(236,72,153,X)` |
| **Primary Cyan** | `#22d3ee` / `rgba(34,211,238,X)` |
| **Alert Red** | `#ff003c` |
| **Dark Background** | `rgba(10, 15, 40, 1)` → `rgba(5, 5, 10, 1)` |

---

## 🌐 Universal Background Plate
> Used by **ALL** full-screen overlays (News Titles + B-Rolls) to immediately cover DaVinci placeholders.

```tsx
// Layer 1 — Radial gradient base
<AbsoluteFill style={{ background: "radial-gradient(circle at center, rgba(10, 15, 40, 1) 0%, rgba(5, 5, 10, 1) 100%)" }}>
  {/* Layer 2 — Scrolling cyan grid */}
  <div style={{
    position: "absolute", inset: 0,
    backgroundImage: "linear-gradient(rgba(34,211,238,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.05) 1px, transparent 1px)",
    backgroundSize: "60px 60px",
    transform: `translateY(${(frame * 0.5) % 60}px)`
  }} />
</AbsoluteFill>
```

---

## 🎬 Cinematic B-Roll (`CinematicBRoll`)
- **Edges**: `8px solid rgba(236,72,153,0.5)` + `inset 0 0 100px rgba(0,0,0,1)` box shadow
- **Video zoom**: Interpolates `1.0 → 1.05` over the clip duration (slow push-in)
- **Entry spring**: `damping: 14, stiffness: 80`
- **Exit**: Fades out over last 10 frames

### Cyan Shimmer SVG (on the 8px border):
```tsx
const rotation = (frame * 4) % 360; // Speed: 4° per frame
<linearGradient>
  stop 0%   → transparent
  stop 30%  → rgba(34,211,238,0.1)
  stop 50%  → rgba(34,211,238,0.9)   ← peak
  stop 70%  → rgba(34,211,238,0.1)
  stop 100% → transparent
</linearGradient>
// Applied as: strokeWidth="8", mixBlendMode: "screen"
// Gradient rotates at 1.2× speed: rotation * 1.2
```

---

## 📏 SVG Border Stroke & Transparency Rules (Global)
> **CRITICAL RULE FOR ALL FUTURE EPISODES:** 
> Do **NOT** use `width="calc(100% - Xpx)"` and `x="Y"` to create an inset SVG border for general UI cards, full-screen masks, or solid backgrounds. Doing so inherently creates a transparent edge/gap between the stroke and the absolute edge of the screen or container.
> 
> **Exception:** This is ONLY permitted on `CinematicBRoll` components, where we *intentionally* want the 8px cyan shimmer border to act as a standalone floating aesthetic frame over the dark background. For all other components, SVG borders must stretch exactly to `100%` width/height or use standard CSS `border` properties to prevent light leaking through transparent edges.

---

## 📰 3D News Titles (`NewsTitle3D`)
- **Container**:
  - `background: linear-gradient(135deg, rgba(20,25,40,0.8), rgba(34,211,238,0.2))`
  - `backdropFilter: blur(40px)`
  - `border: 2px solid rgba(34,211,238,0.3)`
  - `borderRadius: 32px`
  - `padding: 60px 100px`
- **Title**: Tajawal, `100px`, weight `900`, color `#fff`, `textShadow: 0 0 40px rgba(34,211,238,0.8)`
- **Subtitle**: `45px`, color `#22d3ee`, `letterSpacing: 8`, `textTransform: uppercase`
- **Cyan Shimmer**: Same gradient as B-Roll but `rx="31"`, `strokeWidth="4"`
- **`titleDelay` prop**: Delays the title card pop-in by N frames while background is already visible (used on News Title #2)

---

## 📋 Google Update Checklist (`FloatingChecklist`)
- Position: `top: 25%, right: 5%`
- Slides in from right via spring, `3D rotateY(-10deg)`
- `border: 2px solid rgba(236,72,153,0.3)`, `borderRadius: 24`
- Cyan shimmer: `rx=23`, two-layer — fast (`strokeWidth: 4`) + slow (`strokeWidth: 6`)
- Items stagger-in with 15-frame delays each

---

## 📝 Quiz Card — اختبارات تحديد المستوى (`QuizCard`)
- Position: **`top: 65%`** (same level as Hologram Cluster & Trauma Alert)
- `perspective(800px) rotateY(10deg)` 3D tilt
- `background: linear-gradient(135deg, rgba(236,72,153,0.95), rgba(10,15,30,0.95))`
- `border: 2px solid #ec4899`

---

## ⚠️ Trauma Alert — تحذير: نكتة سمجة (`TraumaAlert`)
- Position: **`top: 65%`** centered horizontally (same level as Quiz Card)
- `background: rgba(18, 0, 0, 0.97)` — fully opaque, NO `backdropFilter` (prevents jitter)
- `border: 2px solid #ff003c`
- `boxShadow: 0 0 100px rgba(255,0,60,0.5), 0 30px 60px rgba(0,0,0,0.9)`
- **Text chromatic aberration** (on h1 only):
  ```tsx
  textShadow: [
    `${Math.sin(localFrame * 0.7) * 2.5}px 0 rgba(0,255,255,0.7)`,
    `${Math.sin(localFrame * 0.7) * -2.5}px 0 rgba(255,0,60,0.7)`,
    `0 0 20px #ff003c`
  ].join(", ")
  ```
- **Screen glitch overlay** (deterministic, no Math.random):
  ```tsx
  opacity: Math.sin(localFrame * 1.8) > 0.88 ? 0.18 : 0
  // white div, mixBlendMode: "difference"
  ```

---

## 📐 Lower Thirds (`LowerThird`)
- Springs in from left (Mariya/pink) or right (Mazen/cyan)
- Float animation: `Math.sin(localFrame * 0.09) * 12` vertical bob
- Mariya: `themeColor="#ec4899"`, direction `left`
- Mazen: `themeColor="#22d3ee"`, direction `right`

---

## 🕐 First Half Timeline (Frames @ 30fps)

| Segment | Component | Start Frame | End Frame | Notes |
|---|---|---|---|---|
| Mariya Lower Third | `LowerThird` | `0` | `100` | |
| Hologram Cluster (3 logos) | `HologramCluster` | `379` | `459` | Position: `top: 65%`, centered |
| Mazen Lower Third | `LowerThird` | `470` | `560` | |
| News Title #1 (OPENAI CODEX) | `NewsTitle3D` | `972` | `1094` | Background covers until 00:36:14 |
| B-Roll 1 (broll-codex.mp4) | `CinematicBRoll` | `1377` | `1455` | |
| Coffee Cup + Smoke | `CoffeeJokeWithSmoke` | `1800` | `1871` | |
| B-Roll 2 (broll-split.mp4) | `CinematicBRoll` | `2082` | `2279` | Replace file with DaVinci slow version |
| News Title #2 (GOOGLE GEMINI) | `NewsTitle3D` | `2251` | `2397` | titleDelay=28, bg ends at 01:19:27 |
| Google Update Checklist | `FloatingChecklist` | `2558` | `2679` | |
| Quiz Card | `QuizCard` | `2959` | `3049` | |
| Trauma Alert | `TraumaAlert` | `3133` | `3200` | |

---

## 🔄 Replacing the Master Video
When DaVinci work is done, just drop the final file as:
```
public/youtube-assets/episode-1-master.mp4
```
No code changes needed — Remotion picks it up automatically.

---

## 🖥️ Render Command
```bash
npx remotion render src/remotion/index.tsx HarfenEpisode1 out/harfen-episode1.mp4 --codec=h264 --crf=18
```
> `--crf=18` = visually lossless quality. Increase to `23` for smaller file size.
