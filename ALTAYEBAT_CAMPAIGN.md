# 🧃 ALTAYEBAT (الطيبات) — PRODUCTION BIBLE & STYLE GUIDE

> **Living Document.** Update this every time a design decision is finalized.
> Everything for this project lives in: `C:\Users\uu\OneDrive\Desktop\the-vista_booking_engine`

---

## 📁 File Map

| Purpose | Path |
| :--- | :--- |
| **Main Commercial Component** | `src/remotion/commercial/AltayebatCommercial.tsx` |
| **Remotion Compositions Registry** | `src/remotion/index.tsx` |
| **Master Video Asset** | `public/altayebat-master.mp4` |
| **Logo — Outer Ring** | `public/youtube-assets/outer-ring.png` |
| **Logo — Teal Heart** | `public/youtube-assets/heart-teal.png` |
| **Logo — Pink Heart** | `public/youtube-assets/heart-pink.png` |
| **This Document** | `ALTAYEBAT_CAMPAIGN.md` |

---

## 🎬 Composition Settings

| Setting | Value |
| :--- | :--- |
| **Composition ID** | `AltayebatCommercial` |
| **Resolution** | `1080 × 1920` (Vertical 9:16) |
| **FPS** | `30` |
| **Total Duration** | `1096 frames` (~36.5 seconds) |
| **Outro Card Starts** | Frame `904` |

### Render Command
```bash
cd "C:\Users\uu\OneDrive\Desktop\the-vista_booking_engine"
npx remotion render src/remotion/index.tsx AltayebatCommercial AltayebatFinal.mp4 --concurrency=1
```
> ⚠️ Always use `--concurrency=1` to eliminate frame jitter on heavy blur/WebGL frames.

---

## 🎨 DESIGN SYSTEM — The Harfen W Laken Standard

### Fonts
| Role | Font | Weight |
| :--- | :--- | :--- |
| **Arabic Body / Slams** | `'Tajawal', 'Cairo', system-ui` | `900` |
| **Arabic Floating Text** | `'Cairo', system-ui` | `900` |
| **Outro Heading** | `'Cairo', system-ui` | `900` |
| **Outro Subtitle** | `'Cairo', system-ui` | `500` |
| **Dedication** | `'Cairo', system-ui` | `500` |

### Brand Colors
| Name | Value | Used For |
| :--- | :--- | :--- |
| **Teal / Cyan** | `#22d3ee` / `rgba(34,211,238,x)` | A.I. label, logo heart glow, smoke |
| **Pink** | `#ec4899` / `rgba(236,72,153,x)` | NEWS label, logo heart glow, smoke |
| **Red Guava** | `rgba(255, 90, 120, 0.95)` | Scanner sweep color on floating text |
| **White** | `rgba(255,255,255,0.9)` | All primary text |
| **Soft White** | `rgba(255,255,255,0.75)` | Dedication text |
| **Muted White** | `rgba(255,255,255,0.7)` | Secondary text (copyright) |
| **Brand Green** | `#B4D330` | Lower-third card border accent |

### Anti-Jitter Rules
> ⚠️ **NEVER use `Math.round()` on animation values.** It causes pixel-snapping × scale jitter.
> ⚠️ **NEVER use `transform: scale()` on text groups.** Always set native font sizes.
> ✅ Always add `translateZ(0)`, `willChange: "transform, opacity"`, `WebkitFontSmoothing: "antialiased"` and `rotate(0.001deg)` to animated text containers.

---

## 📝 TYPOGRAPHY SLAMS — Lower Third Cards

### Card Style
```tsx
background: "rgba(20, 20, 20, 0.4)"
backdropFilter: "blur(12px)"
padding: "16px 32px"
borderRadius: "8px"
borderRight: "6px solid #B4D330"   // ← Brand accent, NEVER change this
boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
```

### Text Style
```tsx
fontFamily: "'Tajawal', 'Cairo', system-ui, -apple-system, sans-serif"
fontSize: "96px"
fontWeight: 900
color: "white"
```

### Gloss Scanner (on card)
```tsx
background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)"
transform: `translateX(${interpolate(frame % 60, [0, 60], [-100, 200])}%)`
```

### Animation
```tsx
// Entrance: spring from bottom
translateY: spring({ frame, fps, config: { damping: 14, mass: 0.5 }, from: 100, to: 0 })
// Opacity: fade in over 10 frames, hold, fade out last 10 frames
opacity: interpolate(frame, [0, 10, duration - 10, duration], [0, 1, 1, 0])
```

### Position
```tsx
justifyContent: "flex-end"    // bottom of screen
alignItems: "flex-end"         // right-aligned (RTL)
paddingBottom: "120px"
paddingRight: "60px"
```

---

## ⏱️ TYPOGRAPHY TIMELINE (frame-accurate @ 30fps)

| Text | Arabic | Start Frame | End Frame | Timecode In | Timecode Out |
| :--- | :--- | :--- | :--- | :--- | :--- |
| الانتعاش | Refreshment | 75 | 150 | 00:02.15 | 00:05.00 |
| الحيوية | Vitality | 169 | 219 | 00:05.19 | 00:07.09 |
| الخفة | Lightness | 225 | 275 | 00:07.15 | 00:09.05 |
| الإصرار | Determination | 304 | 340 | 00:10.04 | 00:11.10 |
| المرونة | Flexibility | 345 | 414 | 00:11.15 | 00:13.24 |
| متعة الشباب | Joy of Youth | 415 | 474 | 00:13.25 | 00:15.24 |
| الاحساس بالقوة | Feeling of Power | 475 | 549 | 00:15.25 | 00:18.09 |
| الحماس | Enthusiasm | 557 | 635 | 00:18.17 | 00:21.05 |
| الدقة | Precision | 655 | 701 | 00:21.25 | 00:23.11 |
| تحدى الجاذبية | Defy Gravity | 705 | 824 | 00:23.15 | 00:27.14 |
| الطيبات | Altayebat | 830 | 860 | 00:27.20 | 00:28.20 |

### Camera Shake Events
| Event | Frame | Timecode |
| :--- | :--- | :--- |
| Bottles Smashing | 415 | 00:13.25 |
| Racket Ball Impact | 652 | 00:21.22 |

---

## 🍓 FLOATING GUAVA TEXT — `احلى عصير جوافة`

> No card. Centered. Appears right after `الطيبات` exits.

### Timing
| Setting | Value |
| :--- | :--- |
| Start Frame | `860` |
| Duration | `44 frames` (~1.5s) |
| End Frame | `904` (outro begins) |

### Style
```tsx
fontFamily: "'Cairo', system-ui, sans-serif"
fontSize: "96px"
fontWeight: 900
color: "white"
position: "flex-end / center"   // same baseline as lower-third cards
paddingBottom: "120px"
```

### Right-to-Left Reveal
```tsx
clipPath: `polygon(${clipLeft}% 0, 100% 0, 100% 100%, ${clipLeft}% 100%)`
// clipLeft goes from 100 → 0 via spring { damping: 14, stiffness: 80 }
```

### Red Guava Scanner
```tsx
// Sweeps across the text in Red Guava color
background: `linear-gradient(110deg,
  transparent ${glossProgress * 100 - 15}%,
  rgba(255, 90, 120, 0.95) ${glossProgress * 100}%,
  transparent ${glossProgress * 100 + 15}%)`
WebkitBackgroundClip: "text"
// glossProgress = (localFrame % 30) / 30  ← fast sweep
```

---

## 🪟 OUTRO CARD — Harfen W Laken Standard

### Card Container
```tsx
width: "100%"
height: "100%"                    // Full 9:16 frame — no floating card
background: "rgba(255,255,255,0.06)"
backdropFilter: "blur(20px)"
borderRadius: "0px"               // Edge to edge
border: "none"
// The black video background provides the contrast
```

### Logo Sizes
```tsx
container: width: "320px", height: "320px"
marginBottom: "60px"
outer-ring.png: 100% of container, rotates on reveal
heart-teal.png: 70% of container, slides from left
heart-pink.png: 70% of container, slides from right
```

### Outro Typography Sizes
| Element | Font Size | Color | Notes |
| :--- | :--- | :--- | :--- |
| حرفين ولكن (h1) | `92px` | `#fff` | Cyan glow text-shadow |
| A.I. (h2) | `56px` | `#22d3ee` | Cyan, `letterSpacing: 8px` |
| NEWS (h2) | `56px` | `#ec4899` | Pink, `letterSpacing: 8px` |
| الذكاء الصناعى بلغتنا (h3) | `40px` | `rgba(255,255,255,0.9)` | `fontWeight: 500` |
| جميع الحقوق محفوظة (p) | `36px` | `rgba(255,255,255,0.7)` | |
| YouTube Link (p) | `30px` | `rgba(255,255,255,0.9)` | `letterSpacing: 3px` |
| Dedication (p) | `34px` | `rgba(255,255,255,0.75)` | `fontWeight: 500`, Cairo |

### Dedication Block
```tsx
// اهداء لروح الدكتور ضياء العوضى
// Appears at OutroCard local frame 90 (slow, dignified spring)
spring({ frame: Math.max(0, frame - 90), fps, config: { damping: 28, stiffness: 40 } })

// Preceded by a thin separator line:
width: "600px", height: "1px"
background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)"
marginBottom: "28px"
```

### Outro Animation Springs
```tsx
// Card entrance
cardScale: spring({ from: 0.5, to: 1, damping: 14, stiffness: 100 })

// Logo
logoSpring: spring({ damping: 18, stiffness: 45 })  // delayed frame 10
tealSlideX: interpolate(logoSpring, [0,1], [-80, -10])
pinkSlideX: interpolate(logoSpring, [0,1], [80, 10])

// Text reveal
textRevealSpring: spring({ damping: 20, stiffness: 60 })  // delayed frame 25
translateY: interpolate(textRevealSpring, [0,1], [40, 0])

// Link fade-in
linkOpacity: interpolate(frame, [45, 75], [0, 1])
```

---

## 🎯 Campaign Overview

| Field | Value |
| :--- | :--- |
| **Brand** | Altayebat (الطيبات) — Premium Guava Juice |
| **Vibe** | Energetic, Calisthenics, Outdoor Action, Premium Nutrition |
| **Format** | ~36.5s Vertical Commercial (1096 frames @ 30fps) |
| **Actors** | Mazen & Mariya |
| **Dedicated To** | روح الدكتور ضياء العوضى 🤍 |

---

## 🎵 Soundtrack Prompt (Suno / Udio)
```
High-energy cinematic phonk, aggressive trap beat, heavy distorted 808 bass,
fast driving rhythm, subtle modern Middle Eastern darbuka percussion loop,
extreme sports commercial vibe, high adrenaline, epic brass hits, no vocals,
instrumental, massive drop at 15 seconds, 130 BPM, fast paced, premium agency quality.
```

---

## 🖼️ Shot List & Seedance Prompts

### Stills Generation (Midjourney — 9:16)

| Shot | Prompt |
| :--- | :--- |
| **01: Splash Intro** | `Macro photography, extreme close-up of a premium Altayebat green sports bottle. Ice cold condensation. Vibrant green guava juice violently splashing out. Black background, moody cinematic volumetric lighting, dramatic deep shadows, vivid green and yellow rim lights, 8k.` |
| **02: Surf (Mariya)** | `A photorealistic action shot of a beautiful young Egyptian woman (Mariya) riding a massive ocean wave on a surfboard off the coast of Hurghada, holding the green sports bottle in one hand. Water splashing violently. Other Middle Eastern surfers cheering in the out-of-focus background. High-contrast cinematic volumetric sunlight. 8k.` |
| **03: Volleyball (Mariya)** | `Low-angle action shot of Mariya diving horizontally in the sand to save a beach volleyball with her right hand, while perfectly holding the glowing green juice bottle in her left. Sand particles flying. Energetic Egyptian friends cheering in the blurred background. Intense cinematic volumetric sunlight, deep shadows. 8k.` |
| **04: Seesaw Extreme** | `A hyper-realistic action shot of two athletic Middle Eastern friends outdoors launching off a giant playground seesaw into the air. One is throwing the green sports bottle to the other. A crowd of amazed Egyptian friends watching in the background. High-shutter speed, high-contrast cinematic volumetric sunlight, dynamic skewed Dutch angle.` |
| **05: Calisthenics (Mazen)** | `A hyper-realistic action shot of a handsome athletic Egyptian man (Mazen) mid-air executing a one-armed muscle-up on an outdoor calisthenics bar in Alexandria. He holds the premium green sports bottle. Arab gym friends cheering in the blurred background. Intense volumetric lens flare, gritty athletic park. 8k.` |
| **06: Parkour (Mazen)** | `Action shot of Mazen mid-air executing a massive parkour wall-flip off an urban concrete wall in Alexandria, holding the green sports bottle. Epic low-angle perspective, steep dynamic Dutch angle. Middle Eastern friends recording him with phones in the background. Cinematic volumetric rim lighting, high contrast.` |
| **07: The Clink** | `A photorealistic action shot of an athletic Egyptian man (Mazen) and an athletic Egyptian woman (Mariya) outdoors, actively laughing and aggressively clinking two premium green sports bottles together. Extreme close up on their hands and the bottles. Guava juice violently splashing mid-air from the impact. Intense cinematic sunburst lens flare shining between the bottles, 8k.` |
| **08: Karate (Mazen)** | `Matrix-style mid-air freeze frame of Mazen executing a flawless flying roundhouse karate kick against a shadowy opponent outdoors. He is holding the green sports bottle. Middle Eastern spectators gasping in the blurred background. Water droplets suspended. Moody dramatic volumetric lighting, deep shadows.` |
| **09: Jump Rope** | `Low-angle action shot of Middle Eastern friends laughing and doing high-speed double-dutch jump rope at a sunlit neighborhood park in Egypt. Nostalgic summer playground vibe, golden hour lighting. Glowing green juice bottle resting on the ground in the foreground. Intense volumetric lens flare, cinematic high contrast, 8k.` |
| **10: Tennis Smash** | `Explosive action shot of Mariya suspended in mid-air hitting a massive tennis serve on an outdoor hardcourt. The green sports bottle is balanced on the net. A vibrant crowd of Egyptian fans in the bleachers in the blurred background. Cinematic volumetric sunlight, steep Dutch angle, hyper-detailed.` |
| **11: Skate (Mariya)** | `Massive action shot of Mariya wearing a pro skate helmet, suspended upside-down in mid-air doing a gravity-defying acrobatic grab high above a deep curved concrete skate bowl in Alexandria. She is holding the sleek green Altayebat bottle. Middle Eastern friends cheering on the rim of the bowl. Steep, crooked Dutch angle camera, dramatic volumetric rim lights.` |
| **12: Studio Finale** | `A high-end studio commercial shot. Mazen and Mariya standing back-to-back in a dark studio. They confidently hold sweating, premium sports bottles up to the camera lens. Moody cinematic volumetric lighting, deep shadows, intense neon green and bright yellow rim lights. 8k.` |

### Seedance Motion Prompts (Action + Camera Only)

| Shot | Duration | Motion Prompt |
| :--- | :--- | :--- |
| **01: Splash Intro** | 2s | `High-speed phantom camera. Juice splashing out of the bottle aggressively in ultra-slow motion. Fast crash-zoom into the water droplets.` |
| **02: Surf** | 2s | `Ultra-fast FPV drone shot pushing in. Dramatic slow-motion wave crashing over the surfboard. Camera whips violently to the right at the very end.` |
| **03: Volleyball** | 2s | `Camera whips in from the left. Extreme slow-motion. Sand explodes violently. Ends with a fast whip pan downward.` |
| **04: Seesaw** | 2s | `Camera whips up rapidly. The bottle floats mid-air between them. Ends with a violent tilt up.` |
| **05: Calisthenics** | 2s | `Dynamic low-angle track. Camera rotates 90 degrees at the end.` |
| **06: Parkour** | 2s | `Spinning camera rotation. Extreme slow-motion. Mazen suspended upside-down.` |
| **07: The Clink** | 2s | `Extreme slow motion as the bottles physically smash together. Juice drops explode violently into the air. Fast crash-zoom into the splashing liquid.` |
| **08: Karate** | 2s | `Pull out rapidly. Extreme slow motion. Ends with a fast crash-zoom into his face.` |
| **09: Jump Rope** | 2s | `Crash zoom out. Ropes whip through the air in slow motion. Ends with a fast whip pan to the right.` |
| **10: Tennis** | 2s | `Camera whips in from the left. Ball flies directly into the camera lens, covering it.` |
| **11: Skate** | 3s | `Extreme slow-motion tracking shot from inside the bowl. Somebody walks in front of lens, wiping to black.` |
| **12: Studio Finale** | 2s | `Wipe reveal from black. Slow aggressive dolly push-in. Intense neon light flickering.` |

