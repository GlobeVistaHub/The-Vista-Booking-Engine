import React from 'react';
import { AbsoluteFill, useCurrentFrame, Easing, interpolate, spring, Img, staticFile, interpolateColors, Video, Sequence, random } from 'remotion';
import { NewsChyron } from '../Episode3/TheHook';

const FPS = 30;
const CYAN = '#00E5CC';
const RED = '#FF0055';
const MAGENTA = '#FF00FF';
const DARK_BG = '#02050A';

// ── COMPONENT: 3D CUBE / MONOLITH ──
const Cube3D: React.FC<{ 
    x: number, y: number, size: number, height: number, 
    color: string, isServer?: boolean, isGpu?: boolean, lockProgress?: number 
}> = ({ x, y, size, height, color, isServer = false, isGpu = false, lockProgress = 0 }) => {
    
    if (height <= 0) return null;

    const faceBg = `rgba(${color === RED ? '255, 0, 85' : '0, 229, 204'}, 0.15)`;
    const faceBorder = `1px solid ${color}`;
    
    const bladeGradient = isServer 
        ? `repeating-linear-gradient(to bottom, transparent, transparent 15px, ${color} 15px, ${color} 16px)`
        : `repeating-linear-gradient(to bottom, transparent, transparent 5px, ${color} 5px, ${color} 6px)`;
    
    const shutterHeight = isServer ? interpolate(lockProgress, [0, 1], [0, height]) : 0;

    return (
        <div style={{
            position: 'absolute', left: x, top: y, width: size, height: size,
            transformStyle: 'preserve-3d', willChange: 'transform'
        }}>
            {/* TOP FACE */}
            <div style={{
                position: 'absolute', width: size, height: size,
                backgroundColor: faceBg, border: faceBorder,
                transform: `translateZ(${height}px)`,
                boxShadow: `inset 0 0 ${isServer ? 40 : 10}px ${color}, 0 0 ${isServer ? 60 : 20}px ${color}`,
                backgroundImage: isGpu ? `repeating-linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.8) 4px, ${color} 4px, ${color} 6px)` : 'none',
                display: 'flex', justifyContent: 'center', alignItems: 'center'
            }}>
                {!isGpu && <div style={{ width: '50%', height: '50%', border: `1px solid ${color}`, opacity: 0.5 }} />}
            </div>
            
            {/* FRONT FACE (Facing Bottom-Left in Isometric) */}
            <div style={{
                position: 'absolute', width: size, height: height,
                backgroundColor: faceBg, border: faceBorder,
                backgroundImage: bladeGradient,
                transformOrigin: 'top', transform: `rotateX(-90deg)`, top: size,
                overflow: 'hidden', opacity: 0.8
            }}>
                {isServer && lockProgress > 0 && (
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: shutterHeight,
                        backgroundImage: `repeating-linear-gradient(-45deg, ${RED} 0, ${RED} 10px, #111 10px, #111 20px)`,
                        borderBottom: `4px solid #FFF`, boxShadow: `0 10px 30px ${RED}`
                    }} />
                )}
            </div>

            {/* RIGHT FACE (Facing Bottom-Right in Isometric) */}
            <div style={{
                position: 'absolute', width: height, height: size,
                backgroundColor: faceBg, border: faceBorder,
                backgroundImage: `repeating-linear-gradient(to right, transparent, transparent ${isServer ? 15 : 5}px, ${color} ${isServer ? 15 : 5}px, ${color} ${isServer ? 16 : 6}px)`,
                transformOrigin: 'left', transform: `rotateY(90deg)`, left: size,
                overflow: 'hidden', opacity: 0.6
            }}>
                {isServer && lockProgress > 0 && (
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: shutterHeight, height: '100%',
                        backgroundImage: `repeating-linear-gradient(-45deg, ${RED} 0, ${RED} 10px, #111 10px, #111 20px)`,
                        borderRight: `4px solid #FFF`, boxShadow: `10px 0 30px ${RED}`
                    }} />
                )}
            </div>
        </div>
    );
};

// ── COMPONENT: ARROW WATERFALL (Continuous plunging arrows) ──
const ArrowWaterfall: React.FC<{ x: number, y: number, delay: number, isActive: boolean }> = ({ x, y, delay, isActive }) => {
    const frame = useCurrentFrame();
    if (!isActive) return null;

    return (
        <div style={{ position: 'absolute', left: x, top: y, transformStyle: 'preserve-3d' }}>
            {[0, 1, 2].map(i => {
                // Staggered continuous loop (90 frames)
                const fallProgress = ((frame + delay + i * 30) % 90) / 90;
                // Fall from high above to far below the floor
                const zPos = interpolate(fallProgress, [0, 1], [3000, -1000]);
                const opacity = interpolate(fallProgress, [0, 0.1, 0.7, 1], [0, 0.8, 0.8, 0]);

                return (
                    <div key={i} style={{
                        position: 'absolute', left: -100, top: -187,
                        width: 200, height: 375,
                        transform: `translateZ(${zPos}px) rotateX(-90deg) rotateY(45deg)`,
                        transformStyle: 'preserve-3d', opacity, transformOrigin: 'bottom',
                        willChange: 'transform'
                    }}>
                        <svg viewBox="0 0 240 450" width="100%" height="100%" style={{ filter: `drop-shadow(0 0 40px ${RED})` }}>
                             <path d="M 60 0 L 100 0 L 100 100 L 140 80 L 140 200 L 180 180 L 180 300 L 220 300 L 140 450 L 60 300 L 100 300 L 100 220 L 60 240 L 60 120 L 20 140 Z" fill={RED} opacity="0.9" />
                         </svg>
                    </div>
                );
            })}
        </div>
    );
};


export const Scene6: React.FC = () => {
  const frame = useCurrentFrame();

  // ── TIMELINE ANCHORS ──
  const F_CRASH = 30;     // 1.0s: The stock market bars start plummeting
  const F_COLLAPSE = 75;  // 2.5s: "لما الفقاعة تنفجر" (Bubble bursts)
  const F_BURST = 115;    // 3.8s: Servers Extrude
  const F_LOCKDOWN = 130; // 4.3s: "الشركات الكبيرة هتقفل سيرفراتها" (Lock their servers)
  const F_ERROR_BANNER = 178; // Brought in another 10 frames earlier
  
  // ── PHASE 2 ANCHORS (Seamless Transition) ──
  const F_DIVE = 230;     // Camera dives completely through the red HUD
  const F_PHASE2 = 245;   // Transition triggers instantly during the dive
  const F_CPU = 265;      // CPU core slams in
  const F_CIRCUIT = 280;  // Circuits draw out
  const F_GPU = 300;      // GPU/RAM extrude
  const F_OPEN_SOURCE = 356; // Syncs to exactly 02:29.22 in the master timeline

  // ── PHASE 3 ANCHORS (Mazen - The Hardware Cost) ──
  const F_PHASE3_DIVE = 440;   // Dive begins right as Mariya finishes
  const F_PHASE3 = 470;        // Reveal the massive industrial GPU Matrix
  const F_GPU_RACKS = 485;     // 1. Rack frames build
  const F_COMPUTE_BLADES = 500; // 2. Left Compute Blades build
  const F_MEMORY_BLADES = 515;  // 3. Right Memory Blades build
  const F_DATA_CABLES = 530;    // 4. Cables connect and data streams
  const F_GPU_SPECS = 550;     // Hardware specs UI pops up
  const F_GPU_COST = 580;      // Massive cost counter
  const F_ADVICE = 641;        // Syncs exactly to 02:36.01 (Banner Entrance)
  const F_ADVICE_SWITCH = 738; // 02:39.08: Hard switch to "قبل فوات الأوان..."
  
  // ── PHASE 4 ANCHORS (The Jet Climax) ──
  const F_PHASE4_WARP = 770;
  const F_PHASE4_JET = 776;
  const F_TXT_1 = 800; // "المشروع: VENOM"
  const F_TXT_2 = 860; // "التاريخ: مارس ٢٠٢٤"
  const F_TXT_3 = 930; // "القيادة: ذكاء اصطناعي مستقل"
  const F_SNAP = 1000; // Flash & Polaroid Snap (Video slowed to 80%)

  // ── PHASE 1 ANIMATION SPRINGS ──
  const crashSpring = spring({ frame: Math.max(0, frame - F_CRASH), fps: FPS, config: { damping: 12, stiffness: 90 } });
  
  const collapseSpring = spring({ frame: Math.max(0, frame - F_COLLAPSE), fps: FPS, config: { damping: 14, stiffness: 80 } });
  const bubbleScale = interpolate(collapseSpring, [0, 1], [0, 1]);
  
  const burstSpring = spring({ frame: Math.max(0, frame - F_BURST), fps: FPS, config: { damping: 12, stiffness: 120 } });
  
  const lockSpring = spring({ frame: Math.max(0, frame - F_LOCKDOWN), fps: FPS, config: { damping: 25, stiffness: 120 } });
  const isLocked = frame >= F_LOCKDOWN;

  const errorBannerSpring = spring({ frame: Math.max(0, frame - F_ERROR_BANNER), fps: FPS, config: { damping: 14, stiffness: 120 } });

  // ── PHASE 2 ANIMATION SPRINGS ──
  const diveSpring = spring({ frame: Math.max(0, frame - F_DIVE), fps: FPS, config: { damping: 50, stiffness: 30 } });
  const p2BoardSpring = spring({ frame: Math.max(0, frame - F_PHASE2), fps: FPS, config: { damping: 14, stiffness: 80 } });
  const p2CpuSpring = spring({ frame: Math.max(0, frame - F_CPU), fps: FPS, config: { damping: 12, stiffness: 100 } });
  const p2CircuitSpring = spring({ frame: Math.max(0, frame - F_CIRCUIT), fps: FPS, config: { damping: 18, stiffness: 70 } });
  const p2GpuSpring = spring({ frame: Math.max(0, frame - F_GPU), fps: FPS, config: { damping: 14, stiffness: 90 } });
  const p2OpenSourceSpring = spring({ frame: Math.max(0, frame - F_OPEN_SOURCE), fps: FPS, config: { damping: 20, stiffness: 60 } });

  // Phase 3 Springs
  const p3DiveSpring = spring({ frame: Math.max(0, frame - F_PHASE3_DIVE), fps: FPS, config: { damping: 50, stiffness: 30 } });
  const p3BoardSpring = spring({ frame: Math.max(0, frame - F_PHASE3), fps: FPS, config: { damping: 14, stiffness: 80 } });
  
  // Sequential Technical Build Springs for Phase 3
  const p3RackSpring = spring({ frame: Math.max(0, frame - F_GPU_RACKS), fps: FPS, config: { damping: 16, stiffness: 90 } });
  const p3ComputeSpring = spring({ frame: Math.max(0, frame - F_COMPUTE_BLADES), fps: FPS, config: { damping: 14, stiffness: 80 } });
  const p3MemorySpring = spring({ frame: Math.max(0, frame - F_MEMORY_BLADES), fps: FPS, config: { damping: 14, stiffness: 80 } });
  const p3CablesSpring = spring({ frame: Math.max(0, frame - F_DATA_CABLES), fps: FPS, config: { damping: 12, stiffness: 70 } });
  
  const p3SpecsSpring = spring({ frame: Math.max(0, frame - F_GPU_SPECS), fps: FPS, config: { damping: 16, stiffness: 100 } });
  const p3CostSpring = spring({ frame: Math.max(0, frame - F_GPU_COST), fps: FPS, config: { damping: 12, stiffness: 60 } });
  const p3AdviceSpring = spring({ frame: Math.max(0, frame - F_ADVICE), fps: FPS, config: { damping: 14, stiffness: 100 } });

  // ── PHASE 4 ANIMATION SPRINGS ──
  const warpSpring = spring({ frame: Math.max(0, frame - F_PHASE4_WARP), fps: FPS, config: { damping: 14, stiffness: 60 } });
  const txt1Spring = spring({ frame: Math.max(0, frame - F_TXT_1), fps: FPS, config: { damping: 12, stiffness: 200 } });
  const txt2Spring = spring({ frame: Math.max(0, frame - F_TXT_2), fps: FPS, config: { damping: 12, stiffness: 200 } });
  const txt3Spring = spring({ frame: Math.max(0, frame - F_TXT_3), fps: FPS, config: { damping: 12, stiffness: 200 } });
  const snapSpring = spring({ frame: Math.max(0, frame - F_SNAP), fps: FPS, config: { damping: 16, stiffness: 120 } });

  // ── STOCK MARKET GRID (6x6 Bar Chart City) ──
  const GRID_SIZE = 6;
  const SPACING = 140;
  const CENTER_X = (GRID_SIZE - 1) * SPACING / 2;
  const CENTER_Y = (GRID_SIZE - 1) * SPACING / 2;
  
  type BarData = { id: string; origX: number; origY: number; rawHeight: number; x: number; y: number; height: number; color: string; opacity: number };
  const bars: BarData[] = [];
  
  for(let i=0; i<GRID_SIZE; i++) {
      for(let j=0; j<GRID_SIZE; j++) {
          const origX = i * SPACING;
          const origY = j * SPACING;
          
          // Highly dynamic fluctuating height based on math/noise
          const fluctuation = Math.sin(i * 1.5 + frame * 0.1) * 60 + Math.cos(j * 2.1 + frame * 0.15) * 50;
          const rawHeight = 150 + fluctuation;
          
          // The Crash physically slams the height to 10
          const currentHeight = interpolate(crashSpring, [0, 1], [rawHeight, 10]);
          
          // The Collapse sucks the bars into the center singularity
          const currentX = interpolate(collapseSpring, [0, 1], [origX, CENTER_X]);
          const currentY = interpolate(collapseSpring, [0, 1], [origY, CENTER_Y]);
          const opacity = interpolate(collapseSpring, [0, 0.8, 1], [1, 0.2, 0]);

          // Shift color from Healthy Cyan to Crash Red
          // Wait, Remotion doesn't have interpolateColors built into interpolate natively for simple ternary, so we use threshold:
          const barColor = crashSpring > 0.3 ? RED : CYAN;

          bars.push({ id: `${i}-${j}`, origX, origY, rawHeight, x: currentX, y: currentY, height: currentHeight, color: barColor, opacity });
      }
  }

  // Camera Shake during burst
  const burstShakeX = burstSpring > 0 && burstSpring < 1 ? Math.sin(frame * 50) * 20 * (1 - burstSpring) : 0;
  const burstShakeY = burstSpring > 0 && burstSpring < 1 ? Math.cos(frame * 60) * 20 * (1 - burstSpring) : 0;

  // ── HOLOGRAPHIC STOCK TICKER (Massive floating number) ──
  const stockValue = Math.floor(interpolate(crashSpring, [0, 1], [45982, 1204], { easing: Easing.out(Easing.poly(3)) }));

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden', perspective: 2000 }}>
      
      {/* =========================================================================
                                 PHASE 1: THE CRASH & LOCKDOWN
          ========================================================================= */}
      {frame < F_PHASE2 + 30 && (
      <AbsoluteFill style={{ 
          // DIVE EFFECT: The entire 3D environment scales forward and fades out smoothly
          transform: `scale(${interpolate(diveSpring, [0, 1], [1, 8])}) translateZ(${interpolate(diveSpring, [0, 1], [0, 800])}px)`,
          opacity: interpolate(diveSpring, [0, 0.7, 1], [1, 1, 0]),
          zIndex: 10
      }}>
          {/* ── BACKGROUND: ESTABLISHED HARFEN STUDIO MATERIAL ── */}
          <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 0 }}>
        <Img 
            src={staticFile('images/episode4/harfen-studio.jpeg')} 
            style={{ 
                width: '100%', height: '100%', objectFit: 'cover', 
                filter: 'blur(35px) grayscale(0.5) sepia(0.4) contrast(1.3) brightness(0.2)' 
            }} 
        />
        
        {/* SUBTLE INTERACTIVE FINANCIAL OVERLAY */}
        {/* Slow moving cross grid */}
        <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `radial-gradient(rgba(0, 229, 204, 0.15) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            transform: `translateY(${frame * 0.5}px)`,
            opacity: 0.5
        }} />
        
        {/* Falling Financial Data (Subtle Matrix Effect) */}
        {[...Array(15)].map((_, i) => {
             // Smoothly interpolate between Cyan and Magenta
             const colorCycle = interpolate(
                 Math.sin(frame * 0.05 + i * 2), // Smooth oscillation
                 [-1, 1], [0, 1]
             );
             const currentColor = interpolateColors(colorCycle, [0, 1], [CYAN, MAGENTA]);

             return (
                 <div key={i} style={{
                     position: 'absolute',
                     left: `${(i + 1) * 6}%`,
                     top: `${(frame * (1.5 + (i % 3))) % 120 - 20}%`, // Cascades down
                     color: currentColor,
                     fontFamily: "'Courier New', monospace", fontSize: 32, fontWeight: 'bold',
                     opacity: 0.45, textShadow: `0 0 15px ${currentColor}`
                 }}>
                     {(4592.11 + i * 123.45).toFixed(2)}
                     <br/>
                     {(1203.44 + i * 54.21).toFixed(2)}
                 </div>
             );
        })}
      </AbsoluteFill>

      {/* ── 2.5D ISOMETRIC ENVIRONMENT ── */}
      <AbsoluteFill style={{ 
          transformStyle: 'preserve-3d',
          transform: `translateX(${burstShakeX}px) translateY(${burstShakeY}px) scale(0.65) rotateX(60deg) rotateZ(45deg)`,
          justifyContent: 'center', alignItems: 'center', zIndex: 10
      }}>
          
          {/* Centered Isometric Plane */}
          <div style={{ position: 'relative', width: CENTER_X * 2, height: CENTER_Y * 2, transformStyle: 'preserve-3d' }}>
            
            {/* 1. THE MARKET GRID (Floor Lines) */}
            <svg style={{ position: 'absolute', inset: -300, width: '180%', height: '180%', overflow: 'visible' }}>
                {bars.map(bar => (
                    bars.filter(n => (Math.abs(n.origX - bar.origX) === SPACING && n.origY === bar.origY) || 
                                      (Math.abs(n.origY - bar.origY) === SPACING && n.origX === bar.origX))
                         .map(target => (
                             <line 
                                key={`line-${bar.id}-${target.id}`}
                                x1={bar.x + 40} y1={bar.y + 40} x2={target.x + 40} y2={target.y + 40} // +40 centers the line under the 80px cube
                                stroke={bar.color} strokeWidth="2"
                                style={{ opacity: bar.opacity * 0.3 }}
                             />
                         ))
                ))}
            </svg>

            {/* 2. HOLOGRAPHIC TICKER & HUD (Floats above the city) */}
            {burstSpring === 0 && (
                <div style={{
                    position: 'absolute', left: CENTER_X, top: CENTER_Y,
                    transform: `translateZ(600px) rotateX(-90deg) rotateY(45deg)`, // Stands up in isometric space
                    transformStyle: 'preserve-3d',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    pointerEvents: 'none'
                }}>
                    <div style={{
                        color: crashSpring > 0.3 ? RED : CYAN, 
                        fontFamily: "'Courier New', monospace", fontSize: 180, fontWeight: 900,
                        textShadow: `0 0 50px ${crashSpring > 0.3 ? RED : CYAN}`,
                        letterSpacing: -5
                    }}>
                        {stockValue.toLocaleString()}
                    </div>
                    {crashSpring > 0.3 && (
                        <div style={{
                            color: '#FFF', backgroundColor: RED, padding: '10px 40px',
                            fontFamily: "'Cairo', sans-serif", fontSize: 60, fontWeight: 'bold', marginTop: 20,
                            letterSpacing: 2, boxShadow: `0 0 40px ${RED}`,
                            opacity: 1, zIndex: 100 // Explicitly forcing full opacity and layer priority
                        }}>
                            تم رصد انهيار شامل
                        </div>
                    )}
                </div>
            )}

            {/* 3. THE 3D STOCK MARKET BARS */}
            {burstSpring === 0 && bars.map(bar => (
                <div key={`bar-${bar.id}`} style={{ opacity: bar.opacity }}>
                    <Cube3D x={bar.x} y={bar.y} size={80} height={bar.height} color={bar.color} />
                </div>
            ))}

            {/* 3.5 CONTINUOUS DATA-WATERFALL CRASH ARROWS (Negative Left Space) */}
            <ArrowWaterfall x={CENTER_X - 450} y={CENTER_Y + 150} delay={0} isActive={crashSpring > 0 && burstSpring === 0} />
            <ArrowWaterfall x={CENTER_X - 250} y={CENTER_Y + 350} delay={15} isActive={crashSpring > 0 && burstSpring === 0} />
            <ArrowWaterfall x={CENTER_X - 550} y={CENTER_Y - 100} delay={30} isActive={crashSpring > 0 && burstSpring === 0} />
            <ArrowWaterfall x={CENTER_X - 200} y={CENTER_Y - 250} delay={45} isActive={crashSpring > 0 && burstSpring === 0} />

            {/* 3.6 CONTINUOUS DATA-WATERFALL CRASH ARROWS (Mirrored Right Space - Pushed far right) */}
            {/* Isometric Reflection: Added +250 to X and -250 to Y to slide them purely right in 2D screen space */}
            <ArrowWaterfall x={CENTER_X + 400} y={CENTER_Y - 700} delay={10} isActive={crashSpring > 0 && burstSpring === 0} />
            <ArrowWaterfall x={CENTER_X + 600} y={CENTER_Y - 500} delay={25} isActive={crashSpring > 0 && burstSpring === 0} />
            <ArrowWaterfall x={CENTER_X + 150} y={CENTER_Y - 800} delay={40} isActive={crashSpring > 0 && burstSpring === 0} />
            <ArrowWaterfall x={CENTER_X +   0} y={CENTER_Y - 450} delay={55} isActive={crashSpring > 0 && burstSpring === 0} />

            {/* 4. THE BUBBLE (Singularity) - INFLATING */}
            {collapseSpring > 0 && burstSpring < 1 && (
                <div style={{
                    position: 'absolute', left: CENTER_X, top: CENTER_Y,
                    width: interpolate(collapseSpring, [0, 1], [0, 600]), // Massive inflation
                    height: interpolate(collapseSpring, [0, 1], [0, 600]),
                    marginLeft: interpolate(collapseSpring, [0, 1], [0, -300]),
                    marginTop: interpolate(collapseSpring, [0, 1], [0, -300]),
                    borderRadius: '50%',
                    backgroundColor: '#FFF',
                    boxShadow: `0 0 150px 50px ${RED}, inset 0 0 50px ${RED}`,
                    // Lift completely off the floor as it inflates
                    transform: `translateZ(${interpolate(collapseSpring, [0, 1], [50, 600])}px)`,
                    opacity: interpolate(burstSpring, [0, 0.2], [1, 0]) // Quick fade out exactly as it bursts
                }} />
            )}

            {/* 4.5 THE BURST SHOCKWAVE */}
            {burstSpring > 0 && (
                <div style={{
                    position: 'absolute', left: CENTER_X, top: CENTER_Y,
                    width: interpolate(burstSpring, [0, 1], [600, 4000]), // Explodes outwards
                    height: interpolate(burstSpring, [0, 1], [600, 4000]),
                    marginLeft: interpolate(burstSpring, [0, 1], [-300, -2000]),
                    marginTop: interpolate(burstSpring, [0, 1], [-300, -2000]),
                    borderRadius: '50%',
                    border: `30px solid #FFF`,
                    boxShadow: `0 0 200px 100px ${RED}, inset 0 0 100px 50px ${RED}`,
                    transform: `translateZ(600px)`,
                    opacity: interpolate(burstSpring, [0, 1], [1, 0]),
                }} />
            )}

            {/* 6. THE CORPORATE MONOLITHS (Extruding Servers) */}
            {burstSpring > 0 && (
                <>
                    {/* Server 1: Center */}
                    <Cube3D 
                        x={CENTER_X - 60} y={CENTER_Y - 60} size={120} height={600 * burstSpring} 
                        color={isLocked ? RED : CYAN} isServer={true} lockProgress={lockSpring} 
                    />
                    {/* Server 2: Top Right */}
                    <Cube3D 
                        x={CENTER_X + 200} y={CENTER_Y - 300} size={120} height={450 * burstSpring} 
                        color={isLocked ? RED : CYAN} isServer={true} lockProgress={lockSpring} 
                    />
                    {/* Server 3: Bottom Left */}
                    <Cube3D 
                        x={CENTER_X - 300} y={CENTER_Y + 200} size={120} height={500 * burstSpring} 
                        color={isLocked ? RED : CYAN} isServer={true} lockProgress={lockSpring} 
                    />
                </>
            )}

          </div>
      </AbsoluteFill>
      </AbsoluteFill>
      )}

      {/* ── 7. THE LOCKDOWN HUD (2D Overlay) ── */}
      {isLocked && (
          <AbsoluteFill style={{ 
              justifyContent: 'center', alignItems: 'center', pointerEvents: 'none', zIndex: 50,
              // Smoothly fade out the massive red stamp EXACTLY as Phase 2 Board fades in
              opacity: interpolate(p2BoardSpring, [0, 0.4], [1, 0])
          }}>
              {/* Red Emergency Overlay */}
              <div style={{
                  position: 'absolute', inset: 0,
                  backgroundColor: 'rgba(255, 0, 85, 0.15)',
                  boxShadow: `inset 0 0 150px ${RED}`,
                  opacity: interpolate(lockSpring, [0, 1], [0, 1])
              }} />

              {/* Massive Glitching Stamp */}
              <div style={{
                  // The Dive Transition physically plunges the camera THROUGH this 2D stamp, scaling it to 60x so the dark background completely engulfs the screen!
                  transform: `scale(${interpolate(lockSpring, [0, 1], [3, 1]) * interpolate(diveSpring, [0, 1], [1, 60])}) translateZ(0)`,
                  filter: `blur(${interpolate(lockSpring, [0, 1], [12, 0])}px)`,
                  willChange: 'transform, filter',
                  display: 'flex', flexDirection: 'column', alignItems: 'center'
              }}>
                  <div style={{
                      color: RED, fontFamily: "'Cairo', sans-serif", fontSize: 130, fontWeight: 900,
                      border: `8px solid ${RED}`, padding: '10px 60px',
                      textShadow: `0 0 40px ${RED}`, boxShadow: `0 0 60px ${RED}, inset 0 0 40px ${RED}`,
                      backgroundColor: 'rgba(5, 0, 0, 0.85)',
                      letterSpacing: 5
                  }}>
                      الوصول مرفوض
                  </div>
                  {/* Hex code scrambling beneath - Highly Readable Contrast */}
                  {frame >= F_ERROR_BANNER && (
                      <div style={{ 
                          color: '#FFF', backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                          border: `2px solid ${RED}`, borderRadius: '8px',
                          padding: '10px 30px', marginTop: 30, 
                          fontFamily: "'Cairo', sans-serif", fontSize: 36, fontWeight: 'bold', 
                          letterSpacing: 2, textShadow: `0 0 20px ${RED}`, boxShadow: `0 0 30px ${RED}`,
                          transform: `scale(${interpolate(errorBannerSpring, [0, 1], [0.8, 1])})`,
                          opacity: interpolate(errorBannerSpring, [0, 1], [0, 1])
                      }}>
                          {Math.floor(frame / 8) % 2 === 0 ? 'خطأ_0XF88A :: تم قطع الاتصال' : 'توقف النظام :: الخادم غير متاح'}
                      </div>
                  )}
              </div>
          </AbsoluteFill>
      )}

      {/* ── GLOBAL TEXTURE: HALFTONE / GRAIN ── */}
      <AbsoluteFill style={{ zIndex: 100, pointerEvents: 'none', mixBlendMode: 'overlay', opacity: 0.4 }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 3px)",
        }} />
      </AbsoluteFill>

      {/* =========================================================================
                                 PHASE 2: THE WORKSTATION
          ========================================================================= */}
      {frame >= F_PHASE2 && frame < F_PHASE3 + 40 && (
          <AbsoluteFill style={{ 
              zIndex: 150, backgroundColor: '#000A15', 
              opacity: interpolate(p2BoardSpring, [0, 0.2], [0, 1]) * interpolate(p3DiveSpring, [0, 0.7, 1], [1, 1, 0]),
              // Phase 3 Dive: Fly straight down into the CPU!
              transform: `scale(${interpolate(p3DiveSpring, [0, 1], [1, 20])}) translateZ(${interpolate(p3DiveSpring, [0, 1], [0, 600])}px)`
          }}>
              
              {/* Optimistic Phase 2 Radiant Background */}
              <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 0 }}>
                {/* Glowing Core Light */}
                <div style={{
                    position: 'absolute', left: '50%', top: '50%', width: 2500, height: 2500,
                    transform: 'translate(-50%, -50%)',
                    background: `radial-gradient(circle, rgba(0, 229, 204, 0.25) 0%, rgba(0, 150, 255, 0.1) 40%, transparent 70%)`
                }} />
                {/* High Speed Data Floor */}
                <div style={{
                    position: 'absolute', inset: 0, opacity: 0.4,
                    backgroundImage: `linear-gradient(rgba(0, 229, 204, 0.2) 2px, transparent 2px), linear-gradient(90deg, rgba(0, 229, 204, 0.2) 2px, transparent 2px)`,
                    backgroundSize: '150px 150px', transform: `perspective(1000px) rotateX(60deg) translateY(${frame * 4 % 150}px)`
                }} />
              </AbsoluteFill>

              {/* 2.5D Isometric Motherboard Environment */}
              <AbsoluteFill style={{ 
                  transformStyle: 'preserve-3d',
                  // Notice rotateZ(-45deg) - we are looking from a completely different angle than Phase 1!
                  transform: `scale(0.8) rotateX(60deg) rotateZ(-45deg)`, 
                  justifyContent: 'center', alignItems: 'center'
              }}>
                  <div style={{ position: 'relative', width: 800, height: 800, transformStyle: 'preserve-3d' }}>
                      
                      {/* 1. The Highly Intricate Silicon Board */}
                      <div style={{
                          position: 'absolute', inset: 0,
                          backgroundColor: 'rgba(0, 20, 30, 0.95)',
                          backdropFilter: 'blur(20px)',
                          border: `2px solid rgba(0, 229, 204, 0.6)`,
                          borderRadius: '25px',
                          boxShadow: `0 0 120px rgba(0, 229, 204, 0.2), inset 0 0 200px rgba(0, 229, 204, 0.15)`,
                          transform: `translateZ(${interpolate(p2BoardSpring, [0, 1], [-1000, 0])}px)`,
                          opacity: p2BoardSpring, display: 'flex', justifyContent: 'center', alignItems: 'center'
                      }}>
                          {/* Rich Board Etchings & Nested Traces */}
                          <div style={{ width: 760, height: 760, border: `2px solid rgba(0, 229, 204, 0.4)`, borderRadius: '20px' }}>
                              <div style={{ margin: 15, width: 726, height: 726, border: `1px dashed rgba(0, 229, 204, 0.3)`, borderRadius: '15px' }} />
                              <div style={{ position: 'absolute', top: 50, left: 50, width: 700, height: 700, backgroundImage: `linear-gradient(rgba(0, 229, 204, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 229, 204, 0.08) 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
                          </div>
                      </div>

                      {/* 2. Massive Multi-Lane SVG Circuit Traces */}
                      <svg style={{ position: 'absolute', inset: 0, width: 800, height: 800, overflow: 'visible', opacity: p2CircuitSpring }}>
                          <g fill="none" stroke={CYAN} strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 6px ${CYAN})` }}>
                              
                              {/* 12-Lane Data Bus from CPU to RAM (Extremely Dense) */}
                              {[...Array(12)].map((_, i) => (
                                  <path key={`ram-bus-${i}`} strokeWidth={i % 3 === 0 ? "3" : "1"} 
                                        d={`M 300 ${360 + i*6} L ${240 - i*3} ${360 + i*6} L ${240 - i*3} 280`} 
                                        strokeDasharray="1500" strokeDashoffset={interpolate(p2CircuitSpring, [0, 1], [1500, 0])} />
                              ))}
                              
                              {/* Massive PCIe Bus from CPU to GPU Arrays */}
                              {[...Array(16)].map((_, i) => (
                                  <path key={`gpu-bus1-${i}`} strokeWidth={i % 4 === 0 ? "3" : "1"} 
                                        d={`M 460 ${380 + i*6} L ${520 + i*4} ${380 + i*6} L ${520 + i*4} 500 L 600 500`} 
                                        strokeDasharray="1500" strokeDashoffset={interpolate(p2CircuitSpring, [0, 1], [1500, 0])} />
                              ))}
                              
                              {/* High Speed Southbridge IO Radiating Downwards */}
                              {[...Array(20)].map((_, i) => (
                                  <path key={`io-bus-${i}`} strokeWidth="1" opacity="0.6"
                                        d={`M ${300 + i*10} 480 L ${300 + i*10} ${560 + (i%2)*20} L ${300 + (i-10)*15} 750`} 
                                        strokeDasharray="1000" strokeDashoffset={interpolate(p2CircuitSpring, [0, 1], [1000, 0])} />
                              ))}
                          </g>
                      </svg>

                      {/* 3. The CPU Core, Socket, and Micro-Components */}
                      <div style={{ 
                          opacity: p2CpuSpring, 
                          transform: `translateZ(${interpolate(p2CpuSpring, [0, 1], [800, 0])}px)` 
                      }}>
                          {/* Massive Gold CPU Socket Base */}
                          <Cube3D x={290} y={290} size={220} height={10} color={'#D4AF37'} />
                          {/* Inner Processor Core */}
                          <Cube3D x={320} y={320} size={160} height={35} color={CYAN} />
                          
                          {/* Dense Micro-Capacitor Banks Arrays */}
                          {[...Array(6)].map((_, i) => (
                              <Cube3D key={`cap-t1-${i}`} x={310 + i*20} y={260} size={10} height={15} color={'#00A4EF'} />
                          ))}
                          {[...Array(6)].map((_, i) => (
                              <Cube3D key={`cap-b1-${i}`} x={310 + i*20} y={510} size={10} height={15} color={'#00A4EF'} />
                          ))}
                          {[...Array(8)].map((_, i) => (
                              <Cube3D key={`cap-l1-${i}`} x={260} y={300 + i*15} size={10} height={15} color={'#00A4EF'} />
                          ))}

                          {/* CPU Holographic Label */}
                          <div style={{
                              position: 'absolute', left: 400, top: 400, transform: 'translateZ(45px) translate(-50%, -50%) rotateZ(45deg) rotateX(-90deg)',
                              color: '#FFF', fontFamily: "'Cairo', sans-serif", fontSize: 32, fontWeight: 'bold', textShadow: `0 0 20px ${CYAN}`
                          }}>
                              المعالج_المركزي
                          </div>
                      </div>

                      {/* 4. RAM & GPU Monoliths (With Heat Sinks) */}
                      <div style={{ opacity: p2GpuSpring }}>
                          
                          {/* Corner Structural Stand-offs */}
                          <Cube3D x={40} y={40} size={40} height={interpolate(p2BoardSpring, [0, 1], [0, 80])} color={'#555'} />
                          <Cube3D x={720} y={40} size={40} height={interpolate(p2BoardSpring, [0, 1], [0, 80])} color={'#555'} />
                          <Cube3D x={40} y={720} size={40} height={interpolate(p2BoardSpring, [0, 1], [0, 80])} color={'#555'} />
                          <Cube3D x={720} y={720} size={40} height={interpolate(p2BoardSpring, [0, 1], [0, 80])} color={'#555'} />

                          {/* 8 Dense RAM Memory Banks */}
                          {[...Array(8)].map((_, i) => (
                              <Cube3D key={`ram-${i}`} x={120 + (i % 4)*25} y={150 + Math.floor(i / 4)*60} size={15} height={interpolate(p2GpuSpring, [0, 1], [0, 130])} color={CYAN} />
                          ))}
                          
                          {/* 4 Massive GPU Tensor Cores with Heat Sink geometries */}
                          {[0, 1].map(x => [0, 1].map(y => (
                              <Cube3D key={`tensor-${x}-${y}`} x={520 + x*120} y={480 + y*140} size={100} height={interpolate(p2GpuSpring, [0, 1], [0, 250])} color={CYAN} isGpu={true} />
                          )))}
                      </div>

                      {/* 5. The Open Source Neural Network Activation */}
                      {p2OpenSourceSpring > 0 && (
                          <div style={{
                              position: 'absolute', left: 400, top: 400,
                              width: 1200, height: 1200, transform: `translate(-50%, -50%) translateZ(250px)`,
                              display: 'flex', justifyContent: 'center', alignItems: 'center'
                          }}>
                              
                              {/* Massive Vertical Data Beam from CPU (Visualizing "Running") */}
                              <div style={{
                                  position: 'absolute', left: '50%', top: '50%', width: 150, height: 2500,
                                  background: `linear-gradient(to top, transparent, rgba(0, 229, 204, 0.9), transparent)`,
                                  transform: `translate(-50%, -50%) rotateX(90deg) rotateY(45deg) scaleY(${interpolate(p2OpenSourceSpring, [0, 1], [0, 1])})`,
                                  boxShadow: `0 0 150px ${CYAN}`, opacity: 0.8
                              }} />

                              {/* Neural Network SVG Mesh */}
                              <svg style={{ 
                                  position: 'absolute', inset: 0, width: 1200, height: 1200, overflow: 'visible', 
                                  transform: `scale(${interpolate(p2OpenSourceSpring, [0, 1], [0, 1.4])}) rotateZ(${frame * 0.4}deg)`,
                                  opacity: interpolate(p2OpenSourceSpring, [0, 0.5, 1], [0, 1, 1]) 
                              }}>
                                  <g stroke={CYAN} style={{ filter: `drop-shadow(0 0 15px ${CYAN})` }}>
                                       {/* Mathematical interlocking neural nodes */}
                                       {[...Array(60)].map((_, i) => {
                                           const r = 200 + (i % 6) * 50;
                                           const a = i * 0.4;
                                           const x = 600 + Math.cos(a) * r;
                                           const y = 600 + Math.sin(a) * r;
                                           const nextR = r + 50;
                                           const x2 = 600 + Math.cos(a + 0.4) * nextR;
                                           const y2 = 600 + Math.sin(a + 0.4) * nextR;
                                           
                                           return (
                                               <React.Fragment key={`neural-node-${i}`}>
                                                   {/* Node Core */}
                                                   <circle cx={x} cy={y} r="5" fill="#FFF" />
                                                   <circle cx={x} cy={y} r="12" fill="none" strokeWidth="2" opacity="0.6" />
                                                   {/* Outward Branch */}
                                                   <line x1={x} y1={y} x2={x2} y2={y2} strokeWidth="3" opacity="0.7" />
                                                   {/* Cross-Ring connection */}
                                                   {i > 0 && <line x1={x} y1={y} x2={600 + Math.cos(a - 0.4) * r} y2={600 + Math.sin(a - 0.4) * r} strokeWidth="1.5" opacity="0.4" />}
                                               </React.Fragment>
                                           );
                                       })}
                                       {/* Central Core Rings */}
                                       <circle cx="600" cy="600" r="140" fill="none" strokeWidth="6" strokeDasharray="30 15" opacity="0.8" />
                                       <circle cx="600" cy="600" r="180" fill="none" strokeWidth="2" strokeDasharray="50 30" opacity="0.5" />
                                  </g>
                              </svg>

                              {/* High-Tech Holographic UI Panel (Floating on the Isometric grid) */}
                              <div style={{
                                   position: 'absolute',
                                   padding: '25px 60px',
                                   border: `2px solid ${CYAN}`,
                                   borderRadius: '15px',
                                   backgroundColor: 'rgba(0, 30, 40, 0.9)',
                                   boxShadow: `0 0 100px rgba(0, 229, 204, 0.5), inset 0 0 40px rgba(0, 229, 204, 0.3)`,
                                   // Perfectly mapped to the 3D grid, just floating up and shifted away from center
                                   transform: `translateY(-350px) translateX(-200px) scale(${interpolate(p2OpenSourceSpring, [0, 1], [0, 1.2])})`,
                                   display: 'flex', flexDirection: 'column', alignItems: 'center'
                              }}>
                                   <div style={{
                                        color: '#FFF', fontFamily: "'Cairo', sans-serif", fontSize: 55, fontWeight: '900',
                                        textShadow: `0 0 40px ${CYAN}`, letterSpacing: 2
                                   }}>
                                        النماذج المفتوحة المصدر
                                   </div>
                                   <div style={{
                                        color: CYAN, fontFamily: "'Courier New', monospace", fontSize: 26, fontWeight: 'bold',
                                        marginTop: 15, letterSpacing: 6, textShadow: `0 0 10px ${CYAN}`, 
                                        opacity: Math.sin(frame * 0.3) * 0.4 + 0.6
                                   }}>
                                        LOCAL_AI_CORE :: ONLINE
                                   </div>
                              </div>
                          </div>
                      )}

                  </div>
              </AbsoluteFill>
          </AbsoluteFill>
      )}

      {/* =========================================================================
                                 PHASE 3: THE COST (GPU MATRIX)
          ========================================================================= */}
      {frame >= F_PHASE3 && frame < F_PHASE4_JET && (
          <AbsoluteFill style={{ 
              zIndex: 300, backgroundColor: '#050200',
              // Keep opacity at 1 so the warp doesn't fade to black
              opacity: interpolate(p3BoardSpring, [0, 0.2], [0, 1]),
              // Massive chaotic hyper-drive zoom
              transform: `scale(${interpolate(warpSpring, [0, 1], [1, 10])}) rotateZ(${interpolate(warpSpring, [0, 1], [0, -10])}deg)`,
              filter: `brightness(${interpolate(warpSpring, [0, 1], [1, 10])}) blur(${interpolate(warpSpring, [0, 1], [0, 20])}px)`,
          }}>
              {/* Massive White Warp Flash Overlay */}
              <div style={{ position: 'absolute', inset: 0, backgroundColor: '#FFF', opacity: warpSpring, zIndex: 1000 }} />
              {/* Optimistic -> Industrial heat lighting */}
              <div style={{
                  position: 'absolute', left: '50%', top: '50%', width: 3000, height: 3000,
                  transform: 'translate(-50%, -50%)',
                  background: `radial-gradient(circle, rgba(255, 100, 0, 0.15) 0%, rgba(50, 0, 0, 0.1) 40%, transparent 70%)`
              }} />
              
              {/* Infinite Orange Data Floor (Matches Phase 2 exactly for continuity) */}
              <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 0 }}>
                  <div style={{
                      position: 'absolute', inset: 0, opacity: 0.4,
                      backgroundImage: `linear-gradient(rgba(255, 100, 0, 0.2) 2px, transparent 2px), linear-gradient(90deg, rgba(255, 100, 0, 0.2) 2px, transparent 2px)`,
                      backgroundSize: '150px 150px', transform: `perspective(1000px) rotateX(60deg) translateY(${frame * 4 % 150}px)`
                  }} />
              </AbsoluteFill>

              <AbsoluteFill style={{ 
                  transformStyle: 'preserve-3d',
                  // Completely different perspective: Low-angle, looking up and panning down a massive Server Farm aisle
                  transform: `scale(0.65) rotateX(75deg) rotateZ(45deg) translateX(${interpolate(p3BoardSpring, [0, 1], [-800, 0])}px) translateY(${interpolate(p3BoardSpring, [0, 1], [-800, 0])}px)`, 
                  justifyContent: 'center', alignItems: 'center'
              }}>
                  <div style={{ position: 'relative', width: 2000, height: 2000, transformStyle: 'preserve-3d' }}>
                       
                       {/* The Data Center Floor (Reflective, glowing orange) */}
                       <div style={{
                           position: 'absolute', inset: 0,
                           backgroundColor: 'rgba(5, 1, 0, 0.95)',
                           border: `2px solid #FF3300`,
                           backgroundImage: `linear-gradient(rgba(255, 50, 0, 0.2) 2px, transparent 2px), linear-gradient(90deg, rgba(255, 50, 0, 0.2) 2px, transparent 2px)`,
                           backgroundSize: '100px 100px',
                           boxShadow: `inset 0 0 300px rgba(255, 0, 0, 0.5)`
                       }}>
                       </div>

                       {/* An Aisle of Massive Towering Server Racks */}
                       {[...Array(10)].map((_, rackIndex) => {
                           // 5 racks on the left, 5 on the right to form a huge aisle
                           const isLeft = rackIndex < 5;
                           const x = isLeft ? 700 : 1300;
                           const y = 300 + (rackIndex % 5) * 300;
                           
                           return (
                               <div key={`rack-${rackIndex}`} style={{ position: 'absolute', left: x, top: y, transformStyle: 'preserve-3d' }}>
                                   {/* 1. Solid Rack Base / Outer Frame (Reverted to original monolithic design) */}
                                   <Cube3D x={0} y={0} size={200} height={600 * p3RackSpring} color="#050100" />
                                   
                                   {/* 1b. Massive Industrial Cooling Fans on top of the Racks */}
                                   <div style={{ transformStyle: 'preserve-3d', transform: `translateZ(${600 * p3RackSpring}px)` }}>
                                       {/* Fan casing */}
                                       <Cube3D x={20} y={20} size={160} height={20 * p3RackSpring} color="#001133" />
                                       {/* Spinning Fan Blades (Electric Blue) */}
                                       <div style={{ 
                                           position: 'absolute', left: 100, top: 100, width: 140, height: 140, 
                                           transform: `translate(-50%, -50%) translateZ(21px) rotateZ(${frame * 20}deg)`,
                                           backgroundImage: 'conic-gradient(from 0deg, transparent 0deg, #0077FF 45deg, transparent 90deg, #0077FF 135deg, transparent 180deg, #0077FF 225deg, transparent 270deg, #0077FF 315deg)',
                                           borderRadius: '50%', opacity: p3RackSpring, boxShadow: '0 0 20px #0077FF'
                                       }} />
                                   </div>
                                   
                                   {/* 2 & 3. Server Blades stacked tightly inside the rack */}
                                   {[...Array(12)].map((_, bladeIndex) => {
                                        const bladeZ = 50 + bladeIndex * 40;
                                        const activeSpring = isLeft ? p3ComputeSpring : p3MemorySpring;
                                        return (
                                            <div key={`blade-${bladeIndex}`} style={{ transformStyle: 'preserve-3d', transform: `translateZ(${bladeZ * activeSpring}px)` }}>
                                                <Cube3D x={10} y={10} size={180} height={20 * activeSpring} color="#111" />
                                                {/* Glowing Edge to simulate Blade LEDs (Color Coded) */}
                                                <div style={{
                                                    position: 'absolute', left: 10, top: 10, width: 180, height: 180,
                                                    borderRight: isLeft ? `6px solid ${bladeIndex % 4 === 0 ? '#00E5CC' : 'rgba(0,229,204,0.4)'}` : 'none',
                                                    borderLeft: !isLeft ? `6px solid ${bladeIndex % 4 === 0 ? '#FF00AA' : 'rgba(255,0,170,0.4)'}` : 'none',
                                                    boxShadow: isLeft ? `10px 0 20px rgba(0,229,204,0.5)` : `-10px 0 20px rgba(255,0,170,0.5)`,
                                                    opacity: activeSpring
                                                }} />
                                            </div>
                                        );
                                   })}
                               </div>
                           );
                       })}
                       
                       {/* 4. EXPLICIT COMPONENT REVEAL: Massive Holographic GPU Processor hovering in the center aisle */}
                       <div style={{
                           position: 'absolute', left: 1000, top: 900,
                           transformStyle: 'preserve-3d',
                           transform: `translateZ(${300 * p3ComputeSpring}px) rotateZ(${frame * -2}deg)`
                       }}>
                           {/* Holographic Processor Substrate */}
                           <Cube3D x={-150} y={-150} size={300} height={10} color="rgba(0, 255, 102, 0.1)" />
                           <div style={{ position: 'absolute', left: 0, top: 0, width: 300, height: 300, transform: 'translate(-50%, -50%)', border: '4px dashed #00FF66', opacity: p3ComputeSpring * 0.5 }} />
                           
                           {/* Holographic Silicon Core */}
                           <Cube3D x={-75} y={-75} size={150} height={40 * p3ComputeSpring} color="rgba(0, 255, 102, 0.4)" />
                           
                           {/* Floating GPU Data Streams */}
                           <div style={{ 
                               position: 'absolute', left: 0, top: 0, width: 150, height: 150, 
                               transform: `translate(-50%, -50%) translateZ(${80 + Math.sin(frame*0.1)*20}px)`, 
                               border: '2px solid #00FF66', boxShadow: '0 0 50px #00FF66',
                               display: 'flex', justifyContent: 'center', alignItems: 'center',
                               color: '#00FF66', fontFamily: 'monospace', fontSize: 24, fontWeight: 'bold', textShadow: '0 0 10px #00FF66',
                               opacity: p3ComputeSpring
                           }}>
                               H100_GPU
                           </div>
                       </div>
                       
                       {/* 4. Overhead Data Cables (SVG) connecting the left and right sides of the aisle */}
                       <div style={{ position: 'absolute', inset: 0, overflow: 'visible', opacity: p3CablesSpring, transform: `translateZ(${650 * p3CablesSpring}px)`, transformStyle: 'preserve-3d' }}>
                           <svg style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
                               <g fill="none" stroke="#FFD700" strokeWidth="4" style={{ filter: `drop-shadow(0 0 10px #FFD700)` }}>
                                   {[...Array(5)].map((_, i) => (
                                       <path 
                                           key={`cable-${i}`} 
                                           d={`M 750 ${400 + i * 300} Q 1100 ${300 + i * 300} 1450 ${400 + i * 300}`} 
                                           strokeDasharray="20 40" 
                                           strokeDashoffset={interpolate(p3CablesSpring, [0, 1], [300, 0]) - (frame * 6)} // Constant high-speed streaming offset
                                       />
                                   ))}
                               </g>
                           </svg>
                       </div>
                  </div>
              </AbsoluteFill>

              {/* 2D Holographic Hardware Specs */}
              {p3SpecsSpring > 0 && (
                  <div style={{
                       position: 'absolute',
                       left: '10%', top: '25%',
                       transform: `scale(${interpolate(p3SpecsSpring, [0, 1], [0.8, 1])}) scale(${interpolate(warpSpring, [0, 1], [1, 15])}) translateZ(${interpolate(warpSpring, [0, 1], [0, 800])}px)`,
                       filter: warpSpring > 0 ? `grayscale(1) contrast(5) invert(${Math.floor(frame / 2) % 2 === 0 ? 1 : 0})` : 'none',
                       opacity: p3SpecsSpring,
                       padding: '25px 40px',
                       borderLeft: `4px solid #FF8800`,
                       backgroundColor: 'rgba(20, 5, 0, 0.85)', backdropFilter: 'blur(10px)',
                       boxShadow: `0 0 80px rgba(255, 80, 0, 0.3)`,
                       display: 'flex', flexDirection: 'column'
                  }}>
                       <div style={{ color: '#FFF', fontFamily: "'Cairo', sans-serif", fontSize: 45, fontWeight: '900', letterSpacing: 2 }}>
                            مواصفات خارقة
                       </div>
                       <div style={{ fontFamily: "'Courier New', monospace", fontSize: 28, fontWeight: 'bold', marginTop: 10, lineHeight: 1.4 }}>
                            {[
                                { text: "PROCESSOR :: H100 GPU CORE", color: "#00FF66" },
                                { text: "COMPUTE   :: TENSOR NODES", color: "#00E5CC" },
                                { text: "MEMORY    :: 80GB HBM3", color: "#FF00AA" },
                                { text: "DATA      :: FIBER BUS", color: "#FFD700" },
                                { text: "COOLING   :: ACTIVE EXHAUST", color: "#0077FF" }
                            ].map((spec, idx) => {
                                // Stagger each line by 6 frames for a very clean, deliberate mechanical readout
                                const itemSpring = spring({ frame: Math.max(0, frame - F_GPU_SPECS - (idx * 6)), fps: 30, config: { damping: 14, stiffness: 120 } });
                                return (
                                    <div key={idx} style={{ 
                                        color: spec.color, 
                                        opacity: itemSpring, 
                                        transform: `translateX(${interpolate(itemSpring, [0, 1], [-20, 0])}px)`
                                    }}>
                                        {spec.text}
                                    </div>
                                );
                            })}
                       </div>
                       {/* Tech Accent */}
                       <div style={{ position: 'absolute', left: 0, top: 0, width: 20, height: 4, backgroundColor: '#FF8800' }} />
                  </div>
              )}

              {/* Massive Cost Counter */}
              {p3CostSpring > 0 && (
                  <div style={{
                       position: 'absolute',
                       right: '10%', top: '35%',
                       transform: `scale(${interpolate(p3CostSpring, [0, 1], [0.8, 1])}) scale(${interpolate(warpSpring, [0, 1], [1, 25])}) translateZ(${interpolate(warpSpring, [0, 1], [0, 1000])}px)`,
                       filter: warpSpring > 0 ? `grayscale(1) contrast(10) invert(${frame % 3 === 0 ? 1 : 0})` : 'none',
                       opacity: p3CostSpring,
                       padding: '25px 40px',
                       borderRight: `4px solid #FF0055`,
                       backgroundColor: 'rgba(20, 0, 5, 0.85)', backdropFilter: 'blur(10px)',
                       boxShadow: `0 0 80px rgba(255, 0, 85, 0.3)`,
                       display: 'flex', flexDirection: 'column', alignItems: 'flex-end'
                  }}>
                       <div style={{ color: '#FFF', fontFamily: "'Cairo', sans-serif", fontSize: 60, fontWeight: '900', textShadow: `0 0 30px #FF0000` }}>
                            تكلفة ضخمة
                       </div>
                       <div style={{ 
                           color: '#FF0055', fontFamily: "'Courier New', monospace", fontSize: 100, fontWeight: 'bold', 
                           marginTop: 10, textShadow: `0 0 50px #FF0055` 
                       }}>
                            {Math.floor(interpolate(p3CostSpring, [0, 1], [0, 250000])).toLocaleString()} EGP
                       </div>
                       {/* Tech Accent */}
                       <div style={{ position: 'absolute', right: 0, top: 0, width: 20, height: 4, backgroundColor: '#FF0055' }} />
                  </div>
              )}

              {/* The Advice / Resolution */}
              {p3AdviceSpring > 0 && (
                  <div style={{
                       position: 'absolute',
                       left: '50%', bottom: '15%',
                       transform: `translate(-50%, 0) scale(${interpolate(p3AdviceSpring, [0, 1], [0.8, 1])}) scale(${interpolate(warpSpring, [0, 1], [1, 30])}) translateZ(${interpolate(warpSpring, [0, 1], [0, 1200])}px)`,
                       filter: warpSpring > 0 ? `grayscale(1) contrast(10) invert(${frame % 2 === 0 ? 0 : 1})` : 'none',
                       opacity: p3AdviceSpring,
                       padding: '20px 80px',
                       borderRadius: '15px',
                       backgroundColor: '#FFF',
                       boxShadow: `0 0 100px #FFF`,
                       display: 'flex', flexDirection: 'column', alignItems: 'center'
                  }}>
                       <div style={{ color: '#000', fontFamily: "'Cairo', sans-serif", fontSize: 50, fontWeight: '900', letterSpacing: 1 }}>
                            {frame < F_ADVICE_SWITCH ? 'اشتغل على مهاراتك الأونلاين' : 'قبل فوات الأوان...'}
                       </div>
                  </div>
              )}
          </AbsoluteFill>
      )}

      {/* =========================================================================
                                 PHASE 4: THE JET CLIMAX (WARP & POLAROID)
          ========================================================================= */}
      {frame >= F_PHASE4_JET && (
          <AbsoluteFill style={{ zIndex: 400, backgroundColor: '#000' }}>
              
              {/* 3. The Flash (Triggers just before F_SNAP to swallow the cut completely) */}
              {frame >= F_SNAP - 2 && frame < F_SNAP + 15 && (
                  <AbsoluteFill style={{ 
                      backgroundColor: '#FFF', 
                      zIndex: 1000, 
                      // Massive pure white snap (No mixBlendMode so it entirely blinds the screen)
                      opacity: interpolate(frame, [F_SNAP - 2, F_SNAP, F_SNAP + 10], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
                  }} />
              )}

              {/* 1. The F-16 Video playing inside the warp (Slowed to 80%) */}
              {frame < F_SNAP && (
                  <Sequence from={F_PHASE4_JET} durationInFrames={F_SNAP - F_PHASE4_JET}>
                      <AbsoluteFill style={{ 
                          opacity: interpolate(frame, [F_PHASE4_JET, F_PHASE4_JET + 5], [0, 1], { extrapolateRight: 'clamp' }),
                          // Pre-snap blowout: freezes/blows out the last 4 frames of the video to sell the physical camera snap
                          transform: `scale(${interpolate(frame, [F_SNAP - 4, F_SNAP], [1, 1.15], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.exp) })})`,
                          filter: `brightness(${interpolate(frame, [F_SNAP - 4, F_SNAP], [1, 5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.exp) })})`
                      }}>
                          <Video 
                              src={staticFile('video/episode4/scene6/asset6-venom-f16-sequence.mp4')}
                              playbackRate={0.8}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.1)' }}
                          />

                          {/* ══ THE DIGITAL FLASH & SLICE GLITCH (Entrance Impact) ══ */}
                          <AbsoluteFill style={{
                              backgroundColor: '#FFF', mixBlendMode: 'overlay', zIndex: 70, pointerEvents: 'none',
                              opacity: interpolate(frame, [F_PHASE4_JET, F_PHASE4_JET + 2, F_PHASE4_JET + 4, F_PHASE4_JET + 8], [0.8, 0, 0.6, 0], { extrapolateLeft: 'clamp', extrapolateRight: "clamp" }),
                          }} />
                          
                          <AbsoluteFill style={{
                              backgroundColor: 'rgba(255, 0, 0, 0.8)', mixBlendMode: 'screen', zIndex: 71, pointerEvents: 'none',
                              opacity: interpolate(frame, [F_PHASE4_JET, F_PHASE4_JET + 4, F_PHASE4_JET + 10], [0.5, 0, 0], { extrapolateLeft: 'clamp', extrapolateRight: "clamp" }),
                          }} />

                          {frame >= F_PHASE4_JET && frame < F_PHASE4_JET + 15 && frame % 3 === 0 && (
                              <div style={{
                                  position: 'absolute', left: 0, right: 0, 
                                  top: `${random(`slice-y-${frame}`) * 60 + 10}%`, 
                                  height: `${random(`slice-h-${frame}`) * 15 + 5}%`,
                                  backgroundColor: 'rgba(0, 255, 255, 0.9)', mixBlendMode: 'difference', zIndex: 72, pointerEvents: 'none',
                                  transform: `translateX(${(random(`slice-x-${frame}`) * 40) - 20}px)`
                              }} />
                          )}

                          {/* ── EPISODE B-ROLL DNA (The Server Montage Scanlines) ── */}
                          <AbsoluteFill style={{ 
                              zIndex: 10, 
                              pointerEvents: "none", 
                              backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 1px, transparent 1px, transparent 3px)", 
                              mixBlendMode: "overlay" 
                          }} />

                          {/* ── EPISODE 3 "GOLDEN ERA" DNA (Vintage Glow & Film Damage) ── */}
                          <AbsoluteFill style={{
                              backgroundImage: "radial-gradient(circle at center, rgba(255,200,100,0.15) 0%, transparent 60%)",
                              mixBlendMode: "screen", pointerEvents: "none", zIndex: 11
                          }} />
                          
                          <AbsoluteFill style={{ pointerEvents: "none", zIndex: 12 }}>
                              {/* Top Right Rust */}
                              <div style={{
                                  position: "absolute", top: "-5%", right: "-5%", width: "40%", height: "30%",
                                  background: "radial-gradient(ellipse at top right, rgba(139, 69, 19, 0.8) 0%, rgba(205, 92, 92, 0.4) 40%, transparent 70%)",
                                  filter: "blur(20px)", mixBlendMode: "multiply"
                              }} />
                              {/* Bottom Left Spill */}
                              <div style={{
                                  position: "absolute", bottom: "-10%", left: "-5%", width: "50%", height: "40%",
                                  background: "radial-gradient(ellipse at bottom left, rgba(160, 82, 45, 0.7) 0%, rgba(139, 0, 0, 0.3) 50%, transparent 80%)",
                                  filter: "blur(25px)", mixBlendMode: "color-burn"
                              }} />
                              {/* Top Left Minor Burn */}
                              <div style={{
                                  position: "absolute", top: "-2%", left: "-2%", width: "25%", height: "20%",
                                  background: "radial-gradient(circle at top left, rgba(210, 105, 30, 0.6) 0%, transparent 70%)",
                                  filter: "blur(15px)", mixBlendMode: "multiply"
                              }} />
                          </AbsoluteFill>
                      </AbsoluteFill>
                  </Sequence>
              )}
              {/* 2. Kinetic Typography (Alternative 1: The "Hollywood Location Stamp") */}
              {frame < F_SNAP && (
                  <AbsoluteFill style={{ padding: '80px 100px', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', direction: 'rtl', zIndex: 450 }}>
                      
                      {frame >= F_TXT_1 && (() => {
                          const t1 = "> المشروع: ";
                          const t2 = "VENOM";
                          const totalChars = t1.length + t2.length;
                          const duration = 40;
                          const localFrame = frame - F_TXT_1;
                          const smoothChars = interpolate(localFrame, [0, duration], [0, totalChars], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
                          
                          const arabicChars = Math.floor(Math.min(smoothChars, t1.length));
                          const cur1 = t1.substring(0, arabicChars);
                          
                          const engProgress = interpolate(smoothChars, [t1.length, totalChars], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
                          const englishWipe = 100 - (engProgress * 100);
                          const showCursor = localFrame < duration || Math.floor(localFrame / 15) % 2 === 0;

                          return (
                              <div style={{ color: '#00FF66', fontFamily: "'Courier New', monospace", fontSize: 90, fontWeight: 'bold', textShadow: '0 8px 25px rgba(0,0,0,0.95), 0 4px 10px rgba(0,0,0,0.9), 0 0 25px rgba(0,255,102,0.6), 0 0 10px #00FF66', marginBottom: 40, whiteSpace: 'pre' }}>
                                  <span>{cur1}</span>
                                  {smoothChars <= t1.length ? (
                                      <span style={{color: '#00FF66', opacity: showCursor ? 1 : 0}}>█</span>
                                  ) : (
                                      <span style={{ position: 'relative', display: 'inline-block' }}>
                                          <span style={{ visibility: 'hidden' }}>{t2}</span>
                                          <span dir="ltr" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', clipPath: `inset(0 ${englishWipe}% 0 0)` }}>
                                              {t2}
                                          </span>
                                          <span style={{ position: 'absolute', top: 0, left: `${engProgress * 100}%`, color: '#00FF66', opacity: showCursor ? 1 : 0 }}>█</span>
                                      </span>
                                  )}
                              </div>
                          );
                      })()}
                      
                      {frame >= F_TXT_2 && (() => {
                          const t1 = "> التاريخ: مارس ٢٠٢٤";
                          const duration = 45;
                          const localFrame = frame - F_TXT_2;
                          const smoothChars = interpolate(localFrame, [0, duration], [0, t1.length], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
                          
                          const arabicChars = Math.floor(Math.min(smoothChars, t1.length));
                          const cur1 = t1.substring(0, arabicChars);
                          const showCursor = localFrame < duration || Math.floor(localFrame / 15) % 2 === 0;

                          return (
                              <div style={{ color: '#00FF66', fontFamily: "'Courier New', monospace", fontSize: 90, fontWeight: 'bold', textShadow: '0 8px 25px rgba(0,0,0,0.95), 0 4px 10px rgba(0,0,0,0.9), 0 0 25px rgba(0,255,102,0.6), 0 0 10px #00FF66', marginBottom: 40, whiteSpace: 'pre' }}>
                                  <span>{cur1}</span>
                                  <span style={{color: '#00FF66', opacity: showCursor ? 1 : 0}}>█</span>
                              </div>
                          );
                      })()}

                      {frame >= F_TXT_3 && (() => {
                          const t1 = "> القيادة: ذكاء اصطناعي مستقل";
                          const duration = 50;
                          const localFrame = frame - F_TXT_3;
                          const smoothChars = interpolate(localFrame, [0, duration], [0, t1.length], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
                          
                          const arabicChars = Math.floor(Math.min(smoothChars, t1.length));
                          const cur1 = t1.substring(0, arabicChars);
                          const showCursor = localFrame < duration || Math.floor(localFrame / 15) % 2 === 0;

                          return (
                              <div style={{ color: '#00FF66', fontFamily: "'Courier New', monospace", fontSize: 90, fontWeight: 'bold', textShadow: '0 8px 25px rgba(0,0,0,0.95), 0 4px 10px rgba(0,0,0,0.9), 0 0 25px rgba(0,255,102,0.6), 0 0 10px #00FF66', marginBottom: 40, whiteSpace: 'pre' }}>
                                  <span>{cur1}</span>
                                  <span style={{color: '#00FF66', opacity: showCursor ? 1 : 0}}>█</span>
                              </div>
                          );
                      })()}
                  </AbsoluteFill>
              )}


              {/* 4. The Polaroid Resolution */}
              {frame >= F_SNAP && (
                  <AbsoluteFill style={{ backgroundColor: '#020202', justifyContent: 'center', alignItems: 'center' }}>
                      
                      {/* Studio Background - Brightened up with parallax and cinematic blur */}
                      <Img 
                          src={staticFile('images/episode4/harfen-studio.jpeg')} 
                          style={{ 
                              position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', 
                              filter: 'blur(8px)',
                              transform: `scale(${interpolate(frame, [F_SNAP, F_SNAP + 150], [1.15, 1])})`,
                          }} 
                      />

                      {/* Mariya Cutout sliding in (With Exact Scene 4 Kinetic Lens Distortion & Directional Blur) */}
                      {(() => {
                          // Prevent any out of bounds spring values from throwing errors
                          const safeSpring = Math.max(0, Math.min(1.5, snapSpring));
                          const motionVelocity = interpolate(safeSpring, [0, 1], [1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
                          
                          // Consistent physics with Scene 4 for her physical squashing/scaling
                          const stretchY = 1 + (motionVelocity * 0.15);
                          
                          // Decouple the visual effects from the physical spring so they aren't swallowed by the flash
                          // Smooth quadratic decay over 30 frames so the blur is visible and holds properly
                          const extendedDecay = interpolate(frame, [F_SNAP, F_SNAP + 30], [1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp', easing: Easing.out(Easing.quad) });
                          const mariyaBlur = interpolate(extendedDecay, [0, 1], [0, 6]); 
                          
                          // Make lens distortion decay twice as fast (15 frames) with a sharper cubic ease so the color aberration snaps back instantly
                          const lensDecay = interpolate(frame, [F_SNAP, F_SNAP + 15], [1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp', easing: Easing.out(Easing.cubic) });
                          const lensDistortion = interpolate(lensDecay, [0, 1], [4, 15]);

                          return (
                              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                                  <Img 
                                      src={staticFile('images/episode4/scene-6/asset6-mariya-camera-snap.png')}
                                      style={{
                                          position: 'absolute', bottom: -40, right: -350, height: '95%',
                                          transform: `translateY(${interpolate(safeSpring, [0, 1], [200, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })}px) scaleY(${stretchY})`,
                                          opacity: interpolate(safeSpring, [0, 1], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
                                          // 100% consistent with Scene 4: Blur -> Red Shift -> Cyan Shift -> Diorama Shadow
                                          filter: `blur(${mariyaBlur}px) drop-shadow(0px ${lensDistortion}px 0px rgba(255,0,0,0.5)) drop-shadow(0px ${-lensDistortion}px 0px rgba(0,255,255,0.5)) drop-shadow(20px 20px 30px rgba(0,0,0,0.8))`,
                                          zIndex: 10,
                                          willChange: 'transform, filter'
                                      }}
                                  />
                              </div>
                          );
                      })()}
                      
                      {/* The Polaroid floating center (Upgraded with War Room Paper DNA) */}
                      <div
                          style={{
                              position: 'absolute', left: '15%', top: '15%', height: '70%', aspectRatio: '1/1.2',
                              transform: `scale(${interpolate(snapSpring, [0, 1], [3, 1])}) rotate(-5deg)`,
                              boxShadow: '0 30px 80px rgba(0,0,0,0.9), 0 10px 20px rgba(0,0,0,0.6)', // Deepened shadow
                              zIndex: 5,
                              overflow: 'hidden', // Keep overlays contained within the polaroid edges
                              borderRadius: 4 // Slight softening of the paper edge
                          }}
                      >
                          {/* 1. Base Polaroid Image */}
                          <Img 
                              src={staticFile('images/episode4/scene-6/asset6-polaroid-f16.png')}
                              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                          
                          {/* 2. Procedural SVG Noise (Archival Paper Grain from War Room) */}
                          <div style={{
                              position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
                              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
                              opacity: 0.15, mixBlendMode: 'multiply'
                          }} />
                          
                          {/* 3. Grimy Vignette (Aged/Burned Edges) */}
                          <div style={{
                              position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
                              background: 'radial-gradient(circle, rgba(0,0,0,0) 40%, rgba(20,10,5,0.4) 100%)',
                              mixBlendMode: 'multiply'
                          }} />
                      </div>
                  </AbsoluteFill>
              )}

          </AbsoluteFill>
      )}

              {/* =========================================================================
                                 GLOBAL HUD & OVERLAYS
          ========================================================================= */}
      
      {/* The 2-Second Breaking News Chyron (02:18.16 -> Frame 20 to 80) */}
      {frame >= 20 && frame <= 85 && (
          <NewsChyron 
              label="انهيار الأسواق المالية" 
              source="أكبر فقاعة في التاريخ" 
              delayFrames={20} 
              exitFrame={80} 
              isMaskRTL={true} 
          />
      )}

    </AbsoluteFill>
  );
};
