# Harfen W Laken — Episode 1 Part 2: Architectural Blueprint

> **Production Bible** — Follow this document exactly. All timings are relative to `episode-1-master-2.mp4` start.
> Design rules: inherit everything from `Harfen_Design_System.md`. New color tokens added below.

---

## ⚙️ Composition Config

| Property | Value |
|---|---|
| **Composition ID** | `HarfenEpisode1Part2` |
| **FPS** | `30` |
| **Resolution** | `1920 × 1080` |
| **Est. Total Frames** | `3420` (~1m 54s) |
| **Master Video** | `public/youtube-assets/episode-1-master-2.mp4` |
| **Font** | `Tajawal` (Arabic) — same as Part 1 |
| **Render Command** | `npx remotion render src/remotion/index.tsx HarfenEpisode1Part2 out/harfen-episode1-part2.mp4 --codec=h264 --crf=18 --concurrency=1` |

---

## 🎨 Part 2 Extended Color Tokens

> INHERIT all Part 1 tokens. Add the following:

| Role | Color | Used In |
|---|---|---|
| **Gold / Coin** | `#f59e0b` / `#fbbf24` | GoldenCoinDrop |
| **Warning Amber** | `#d97706` / `#f59e0b` | News Title #4, RedWarningShield |
| **Soccer Green** | `#16a34a` / `#22c55e` | News Title #5 |
| **Deep Blue** | `#1e3a8a` / `#1d4ed8` | News Title #3 bg |
| **Lockdown Chain** | `#78350f` + `#f59e0b` glow | B-Roll 4 vignette tint |

---

## 📦 Assets Required

### ✅ Master Video (Already in `youtube-assets`)
- `public/youtube-assets/episode-1-master-2.mp4`

### 🎬 B-Roll Videos (Place in `public/youtube-assets/episode-1-part-2-assets/`)
| Filename | Duration | Prompt |
|---|---|---|
| `broll-chrome.mp4` | **10 sec** | See B-Roll 3 prompt below |
| `broll-lockdown.mp4` | **10 sec** | See B-Roll 4 prompt below (cut to 8s in DaVinci) |
| `broll-soccer.mp4` | **5 sec** | See B-Roll 5 prompt below |

### 🖼️ Static Image Assets (Place in `public/youtube-assets/episode-1-part-2-assets/`)
| Filename | Description |
|---|---|
| `coin-gold.png` | Single glowing golden coin, transparent background, 3D render |
| `warning-shield.png` | Red/amber warning shield icon, glassmorphic, transparent bg |
| `pin-icon.png` | Chat pin/thumbtack icon, cyan glowing, transparent bg |
| `like-3d.png` | Thumbs up icon, 3D rendered, cyan-pink gradient |
| `subscribe-3d.png` | Bell icon, 3D rendered, cyan-pink gradient |

---

## 🎬 B-Roll Generation Prompts (Confirmed)

### B-Roll 3 — "The Seamless Selection" (10 sec)
**File:** `broll-chrome.mp4`

> Cinematic over-the-shoulder shot. A person's hand reaches out and swipes across a floating, complex architectural blueprint and chaotic data visualization charts suspended in mid-air. As the finger swipes, the chaotic data instantly crystallizes and collapses into a clean, glowing, minimalist golden folder icon with a satisfying snap. Bright, modern, sunlit office environment with deep navy blue accent walls. Shallow depth of field, 50mm cinematic lens, highly tactile and satisfying motion, warm sunlight, 8K, photorealistic.

**Why it's different from B-Rolls 1 & 2:** Bright daytime, human hands, golden warmth — complete visual contrast to the dark cyberpunk B-Roll 1 (robot) and the split-screen B-Roll 2.

---

### B-Roll 4 — "The Government Lockdown" (10 sec → cut to 8s in DaVinci)
**File:** `broll-lockdown.mp4`

> Cinematic slow-motion interior of a dark, opulent government boardroom. A group of silhouetted men in sharp dark suits (politicians) stand around a large oval table. At the center of the table sits a pulsing, glowing cyan AI core hologram. One of the men raises a heavy wooden judge's gavel and slams it down onto the desk. The moment it hits, heavy metallic lockdown chains burst from the floor and wrap around the glowing AI core, which immediately flickers and dims, now encased and trapped. Warning amber glow emanates from the chains. Dramatic political thriller lighting, deep shadows, cinematic fog, 8K.

**Why it's different:** Political/human drama, amber-red tones, dark wood aesthetic — completely distinct from B-Roll 3 (bright office) and B-Roll 1 (cyberpunk tech).

---

### B-Roll 5 — "The AI Soccer Spectacle" (5 sec)
**File:** `broll-soccer.mp4`

> Hyper-futuristic holographic soccer stadium bathed in neon cyan and electric green light. Aerial shot zooming into the pitch. A glowing AI soccer ball made of pure digital light is kicked with explosive force, leaving a spectacular trail of flowing binary data, numbers, and digital particles in its wake. The stadium crowd is rendered as glowing holographic silhouettes. Sports commercial aesthetic, dynamic motion blur, 8K, cinematic.

**Why it's different:** Sports energy, outdoor scale, green/cyan — the only bright, energetic, green-tinted shot in the entire episode.

---

## 🕐 Part 2 Timeline — Frame-Perfect Mapping (30fps)

| # | Segment | Component | Start Frame | End Frame | Duration | Notes |
|---|---|---|---|---|---|---|
| 1 | Million Pound Dream | `GoldenCoinDrop` | `180` | `270` | 3s | Triggers on "مليون جنيه" |
| 2 | **News Title #3** CHROME: SELECT FROM SCREEN | `NewsTitle3D` (blue/cyan variant) | `210` | `480` | 9s | Deep blue bg, digital glitch in/out |
| 3 | B-Roll 3 (chrome) | `CinematicBRoll` | `480` | `780` | 10s | `broll-chrome.mp4` |
| 4 | **News Title #4** GPT & GEMINI: DELAYED | `NewsTitle3D` (amber variant, slow zoom) | `930` | `1140` | 7s | Text slowly zooms in over 7s |
| 5 | B-Roll 4 (lockdown) | `CinematicBRoll` | `1320` | `1560` | 8s | `broll-lockdown.mp4`, amber vignette tint |
| 6 | Red Warning Shield | `RedWarningShield` | `1680` | `1830` | 5s | During government rant |
| 7 | **News Title #5** OPENAI: SPORTS & PINS | `NewsTitle3D` (green/white variant) | `1860` | `1980` | 4s | Green + white + cyan |
| 8 | Pin Chat VFX | `PinChatGlassmorphic` | `2100` | `2280` | 6s | During ChatGPT pin segment |
| 9 | B-Roll 5 (soccer) | `CinematicBRoll` | `2310` | `2460` | 5s | `broll-soccer.mp4`, green shimmer |
| 10 | A/B Poll Card | `ABPollCard` | `3240` | `3420` | 6s | [ميزة الشغل] vs [ميزة الكورة] |
| 11 | Floating Like/Subscribe | `FloatingCTAButtons` | `3030` | `3420` | 13s | Stagger in at 3030, 3090 |

> ⚠️ **Note:** Timestamps above are ESTIMATES. Calibrate exact frames after reviewing the master-2 video in studio. Use the same method as Part 1 (scrub to exact frame in Remotion Studio).

---

## 🆕 New VFX Components Required

### 1. `GoldenCoinDrop`
- 3D golden coin pops up at Mazen's position (right side, `bottom: 30%, right: 10%`)
- Spring bounce-in, then gentle float with `Math.sin` bob
- Gold color: `#f59e0b`, glow: `0 0 40px rgba(245,158,11,0.8)`
- Text badge: **$1M** in bold pink on gold background

### 2. `NewsTitle3D` — Extended with Color Props
- Add `accentColor` and `bgGradient` props
- **Title #3 (Blue/Cyan):** `accentColor="#22d3ee"`, bg deep blue, digital glitch CSS filter on entry
- **Title #4 (Amber/Red):** `accentColor="#f59e0b"`, bg dark red, text scales slowly `1.0 → 1.15` over duration
- **Title #5 (Green):** `accentColor="#22c55e"`, bg dark green, same shimmer but green gradient

### 3. `RedWarningShield`
- Centered, `top: 30%`
- Glassmorphic card, `border: 2px solid #ff003c`
- Glitching/pulsing red shield SVG icon
- Text: **⚠ تدخل حكومي** in Arabic

### 4. `PinChatGlassmorphic`
- Lower-right position, slides in from right
- Shows a chat bubble with a pin/thumbtack locking it
- Cyan border, ping animation on the pin

### 5. `ABPollCard`
- Centered, full-width glassmorphic card
- Two sides: `[ميزة الشغل]` (cyan) vs `[ميزة الكورة]` (green)
- Animated progress bars that swing back and forth
- Arabic RTL text, Tajawal font

### 6. `FloatingCTAButtons`
- `LikeButton`: pink/red 3D box, bottom-left
- `SubscribeButton`: cyan 3D box, bottom-right
- Both float with `Math.sin` bob, spring entry from bottom

---

## 🔒 Inherited Design Rules (from Design System)

1. **Background Plate**: ALL full-screen overlays use the dark radial gradient + scrolling cyan grid
2. **B-Roll Edges**: `8px solid rgba(236,72,153,0.5)` — keep for ALL B-Rolls including new ones (for brand consistency)
3. **Cyan Shimmer**: All cards get the rotating SVG shimmer. For green-themed cards (B-Roll 5, Title #5), use `rgba(34,211,238,0.9)` shimmer still — the BRAND shimmer stays cyan even on green cards.
4. **Font**: Tajawal everywhere for Arabic, no exceptions
5. **No backdropFilter on alerts/modals** — use `rgba(X,X,X,0.97)` solid backgrounds to prevent jitter
6. **Scale-down exit**: `entry * exit` pattern — exit uses `interpolate(frame, [duration-10, duration], [1, 0])`

---

## 📝 Implementation Order

```
Phase 1: Register composition in index.tsx
Phase 2: Extend NewsTitle3D with accentColor + bgGradient props
Phase 3: Build GoldenCoinDrop component
Phase 4: Build RedWarningShield component  
Phase 5: Build PinChatGlassmorphic component
Phase 6: Build ABPollCard + FloatingCTAButtons
Phase 7: Wire all components into HarfenEpisode1Part2.tsx
Phase 8: Fine-tune timestamps in studio
Phase 9: Render
```
