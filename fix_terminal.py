with open(r'src\remotion\youtube\Episode3\Topic4AlphaFold.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# ── 1. White terminal: exitFrame 323 → 330 ──
content = content.replace(
    '<AlphaFoldTerminal delay={244} exitFrame={323} />',
    '<AlphaFoldTerminal delay={244} exitFrame={330} />'
)

# ── 2. TimeCollapseWidget: individual exits + panel-level wipes ──
old_widget_body = '''  const exitEnd = exitFrame - delay;
  const exitStart = exitEnd - 12;

  // StrawberryTerminal exit pattern: no jitter
  const progress = interpolate(
    lf,
    [0, 12, exitStart, exitEnd],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );
  const opacity = progress;
  if (lf > exitEnd) return null;

  // Panel 1: Humans 5 Years — scan reveal RIGHT to LEFT
  // inset(0 0 0 X%) = clips from LEFT = reveals from RIGHT first (RTL)
  const scan1 = interpolate(lf, [5, 28], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const scanLine1Visible = lf >= 5 && lf <= 28;
  // scan line at left edge of revealed area (moves right-to-left): left: scan1%
  const scanLine1Left = scan1;

  // Panel 2: AlphaFold 3 Minutes — enters 90 frames after panel 1 (3 sec = 01:58.19)
  const p2Start = 90;
  const scan2 = interpolate(lf, [p2Start + 5, p2Start + 28], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const scanLine2Visible = lf >= p2Start + 5 && lf <= p2Start + 28;
  const scanLine2Left = 100 - scan2;

  // Progress bars (kept deterministic — no jitter)
  const labBarWipe = interpolate(lf, [10, 300], [100, 95], { extrapolateRight: "clamp" });
  const aiBarWipe = interpolate(lf, [p2Start + 30, p2Start + 45], [100, 0], { extrapolateRight: "clamp" });
  // ٣ دقايق individual RTL reveal @ 02:00.03 (lf=134 relative to widget)
  const threeMinWipe = interpolate(lf, [134, 154], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });'''

new_widget_body = '''  // exitFrame param = scene-local frame when BOTH panels done exiting (local 680)
  const exitEnd = exitFrame - delay; // 185
  if (lf > exitEnd) return null;

  // Panel 1: Humans 5 Years — entry [0→12], exit [171→183] (02:01.22)
  const p1Progress = interpolate(lf, [0, 12, 171, 183], [0, 1, 1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  // Exit wipe: reverse of entry (RTL exit: hide from right)
  const p1ExitWipe = interpolate(lf, [171, 183], [0, 100], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Panel 1 scan entry RTL
  const scan1 = interpolate(lf, [5, 28], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const scanLine1Visible = lf >= 5 && lf <= 28;
  const scanLine1Left = scan1;

  // Panel 2: AlphaFold 3 Minutes — entry [90→102], exit [173→185] (02:01.24)
  const p2Start = 90;
  const p2Progress = interpolate(lf, [p2Start, p2Start + 12, 173, 185], [0, 1, 1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const p2ExitWipe = interpolate(lf, [173, 185], [0, 100], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Panel 2 scan entry LTR
  const scan2 = interpolate(lf, [p2Start + 5, p2Start + 28], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const scanLine2Visible = lf >= p2Start + 5 && lf <= p2Start + 28;
  const scanLine2Left = 100 - scan2;

  // Progress bars (deterministic — no jitter)
  const labBarWipe = interpolate(lf, [10, 300], [100, 95], { extrapolateRight: "clamp" });
  const aiBarWipe = interpolate(lf, [p2Start + 30, p2Start + 45], [100, 0], { extrapolateRight: "clamp" });
  // \u0663 \u062f\u0642\u0627\u064a\u0642 individual RTL reveal @ 02:00.03 (lf=134 relative to widget)
  const threeMinWipe = interpolate(lf, [134, 154], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });'''

if old_widget_body in content:
    content = content.replace(old_widget_body, new_widget_body, 1)
    print("Widget body replaced")
else:
    print("Widget body NOT FOUND")

# ── 3. Update panel wrappers to use p1Progress/p2Progress opacity + exit wipe ──
old_panel1_wrapper = '''      {/* PANEL 1: HUMANS IN LAB (5 YEARS) — scan reveal */}
      <div style={{ position: "relative", overflow: "hidden", borderRadius: 16 }}>
        {/* Content revealed RTL by scan */}
        <div style={{
          clipPath: `inset(0 0 0 ${scan1}%)`,'''

new_panel1_wrapper = '''      {/* PANEL 1: HUMANS IN LAB (5 YEARS) — scan entry RTL, exit wipe RTL */}
      <div style={{ position: "relative", overflow: "hidden", borderRadius: 16, opacity: p1Progress }}>
        <div style={{
          clipPath: lf < 30 ? `inset(0 0 0 ${scan1}%)` : `inset(0 ${p1ExitWipe}% 0 0)`,'''

if old_panel1_wrapper in content:
    content = content.replace(old_panel1_wrapper, new_panel1_wrapper, 1)
    print("Panel 1 wrapper replaced")
else:
    print("Panel 1 wrapper NOT FOUND")

old_panel2_wrapper = '''      {/* PANEL 2: ALPHAFOLD 3 MINUTES — enters 90 frames later */}
      {lf >= p2Start && (
        <div style={{ position: "relative", overflow: "hidden", borderRadius: 16 }}>
          <div style={{
            clipPath: `inset(0 ${scan2}% 0 0)`,'''

new_panel2_wrapper = '''      {/* PANEL 2: ALPHAFOLD 3 MINUTES — enters 90 frames later, exits at 02:01.24 */}
      {lf >= p2Start && (
        <div style={{ position: "relative", overflow: "hidden", borderRadius: 16, opacity: p2Progress }}>
          <div style={{
            clipPath: lf < p2Start + 30 ? `inset(0 ${scan2}% 0 0)` : `inset(0 0 0 ${p2ExitWipe}%)`,'''

if old_panel2_wrapper in content:
    content = content.replace(old_panel2_wrapper, new_panel2_wrapper, 1)
    print("Panel 2 wrapper replaced")
else:
    print("Panel 2 wrapper NOT FOUND")

# ── 4. Remove the outer wrapper opacity (was `opacity`) since each panel has its own ──
old_wrapper_opacity = '''      display: "flex", flexDirection: "column", gap: 30,
      opacity
    }}>'''

new_wrapper_opacity = '''      display: "flex", flexDirection: "column", gap: 30
    }}>'''

if old_wrapper_opacity in content:
    content = content.replace(old_wrapper_opacity, new_wrapper_opacity, 1)
    print("Outer opacity removed")
else:
    print("Outer opacity NOT FOUND")

# ── 5. TimeCollapseWidget render call: exitFrame=780 → exitFrame=680 ──
content = content.replace(
    '<TimeCollapseWidget delay={495} exitFrame={780} />',
    '<TimeCollapseWidget delay={495} exitFrame={680} />'
)

# ── 6. pose5End: 720 → 712 (02:02.26, Mariya goes left + pose 2) ──
content = content.replace(
    '  const pose5End = 720; // Pose 2 \u2192 Authoritative',
    '  const pose5End = 712; // 02:02.26 - Pose 3 \u2192 Pose 2, Mariya moves left'
)

# ── 7. slide5 direction: currently wrong, fix to move LEFT ──
old_slide5_x = '''    + interpolate(slide5, [0, 1], [0, -8]); // Final authoritative'''
new_slide5_x = '''    - interpolate(slide5, [0, 1], [0, 16]); // LEFT for pose 2 / Drug Discovery'''

if old_slide5_x in content:
    content = content.replace(old_slide5_x, new_slide5_x, 1)
    print("slide5 direction fixed")
else:
    print("slide5 direction NOT FOUND")

# ── 8. Mariya initial position: add +6% base offset (centered, slightly left) ──
old_xoffset_base = '''  const xOffsetNum =
    interpolate(slide1, [0, 1], [0, 20])   // RIGHT for white terminal'''
new_xoffset_base = '''  const xOffsetNum =
    6                                       // Base: almost centered, leaning left
    + interpolate(slide1, [0, 1], [0, 20])  // RIGHT for white terminal'''

if old_xoffset_base in content:
    content = content.replace(old_xoffset_base, new_xoffset_base, 1)
    print("base offset added")
else:
    print("base offset NOT FOUND")

# ── 9. DrugDiscoveryCard: delay 600 → 717, enter from right, fix jitter ──
old_drug_card = '''const DrugDiscoveryCard: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lf = frame - delay;
  if (lf < 0) return null;

  const pop = spring({ frame: lf, fps, config: { damping: 14, stiffness: 180 } });
  const scale = interpolate(pop, [0, 1], [0.8, 1]);
  const yOffset = interpolate(pop, [0, 1], [50, 0]);
  
  // Staggered text wipes
  const wipe1 = interpolate(lf, [10, 25], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const wipe2 = interpolate(lf, [25, 40], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <div style={{
      position: "absolute", top: "35%", right: "8%", left: "auto",
      transform: `scale(${scale}) translateY(${yOffset}px)`, opacity: pop,
      transformOrigin: "center center", zIndex: 140,
      backgroundColor: "rgba(0,0,0,0.75)",
      border: `2px solid ${CYAN}66`,
      borderRadius: 24,
      padding: "40px 60px",
      boxShadow: `0 30px 60px rgba(0,0,0,0.8), inset 0 0 60px ${CYAN}22`,
      backdropFilter: "blur(20px)",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 15
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, clipPath: `inset(0 0 0 ${wipe1}%)` }}>
        <div style={{ width: 24, height: 24, borderRadius: "50%", backgroundColor: CYAN, boxShadow: `0 0 20px ${CYAN}` }} />
        <span style={{ color: "#FFF", fontSize: 48, fontWeight: 900, fontFamily: "'Cairo', sans-serif" }}>\u062a\u0635\u0645\u064a\u0645 \u0623\u062f\u0648\u064a\u0629 \u062c\u062f\u064a\u062f\u0629</span>
      </div>
      
      <div style={{ display: "flex", alignItems: "center", gap: 20, clipPath: `inset(0 0 0 ${wipe2}%)` }}>
        <div style={{ width: 24, height: 24, borderRadius: "50%", backgroundColor: MAGENTA, boxShadow: `0 0 20px ${MAGENTA}` }} />
        <span style={{ color: MAGENTA, fontSize: 42, fontWeight: 900, fontFamily: "'Cairo', sans-serif", textShadow: `0 0 20px ${MAGENTA}66` }}>\u0623\u0642\u0644 \u0628\u0645\u0644\u0627\u064a\u064a\u0646 \u0627\u0644\u062f\u0648\u0644\u0627\u0631\u0627\u062a</span>
      </div>
      
      {/* Dynamic Pulse Line */}
      <div style={{
        width: "100%", height: 4, marginTop: 20, borderRadius: 2,
        background: `linear-gradient(90deg, transparent, ${CYAN}, ${MAGENTA}, transparent)`,
        opacity: Math.sin(frame * 0.1) * 0.5 + 0.5
      }} />
    </div>
  );
};'''

new_drug_card = '''const DrugDiscoveryCard: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lf = frame - delay;
  if (lf < 0) return null;

  // Entry from RIGHT: spring-based translateX, no scale+translateY jitter
  const entrySpring = spring({ frame: lf, fps, config: { damping: 18, stiffness: 200 } });
  const xEntry = interpolate(entrySpring, [0, 1], [300, 0]);
  const opacity = interpolate(entrySpring, [0, 1], [0, 1]);

  // Staggered text wipes (RTL: reveals from right to left)
  const wipe1 = interpolate(lf, [10, 25], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const wipe2 = interpolate(lf, [25, 40], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  // Pulse: deterministic sine (no Math.random jitter)
  const pulseOpacity = interpolate(Math.sin(lf * 0.12), [-1, 1], [0.3, 0.9]);

  return (
    <div style={{
      position: "absolute", top: "30%", right: "5%", left: "auto",
      transform: `translateX(${xEntry}px)`, opacity,
      zIndex: 140,
      backgroundColor: "rgba(0,0,0,0.75)",
      border: `2px solid ${CYAN}66`,
      borderRadius: 24,
      padding: "40px 60px",
      boxShadow: `0 30px 60px rgba(0,0,0,0.8), inset 0 0 60px ${CYAN}22`,
      backdropFilter: "blur(20px)",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 15
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, clipPath: `inset(0 ${wipe1}% 0 0)` }}>
        <div style={{ width: 24, height: 24, borderRadius: "50%", backgroundColor: CYAN, boxShadow: `0 0 20px ${CYAN}` }} />
        <span style={{ color: "#FFF", fontSize: 48, fontWeight: 900, fontFamily: "'Cairo', sans-serif" }}>\u062a\u0635\u0645\u064a\u0645 \u0623\u062f\u0648\u064a\u0629 \u062c\u062f\u064a\u062f\u0629</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 20, clipPath: `inset(0 ${wipe2}% 0 0)` }}>
        <div style={{ width: 24, height: 24, borderRadius: "50%", backgroundColor: MAGENTA, boxShadow: `0 0 20px ${MAGENTA}` }} />
        <span style={{ color: MAGENTA, fontSize: 42, fontWeight: 900, fontFamily: "'Cairo', sans-serif", textShadow: `0 0 20px ${MAGENTA}66` }}>\u0623\u0642\u0644 \u0628\u0645\u0644\u0627\u064a\u064a\u0646 \u0627\u0644\u062f\u0648\u0644\u0627\u0631\u0627\u062a</span>
      </div>

      {/* Pulse Line — deterministic, no jitter */}
      <div style={{
        width: "100%", height: 4, marginTop: 20, borderRadius: 2,
        background: `linear-gradient(90deg, transparent, ${CYAN}, ${MAGENTA}, transparent)`,
        opacity: pulseOpacity
      }} />
    </div>
  );
};'''

if old_drug_card in content:
    content = content.replace(old_drug_card, new_drug_card, 1)
    print("DrugDiscoveryCard replaced")
else:
    print("DrugDiscoveryCard NOT FOUND - checking...")
    idx = content.find('DrugDiscoveryCard')
    print(f"Found at index: {idx}")

# ── 10. DrugDiscoveryCard render call: delay=600 → delay=717 ──
content = content.replace(
    '<DrugDiscoveryCard delay={600} />',
    '<DrugDiscoveryCard delay={717} />'
)

with open(r'src\remotion\youtube\Episode3\Topic4AlphaFold.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("ALL DONE")
