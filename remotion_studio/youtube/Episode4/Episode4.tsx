import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  spring,
  interpolate,
} from 'remotion';
import { Episode4Scene1 } from './Scene1';
import { Scene2Content } from './Scene2';
import { Scene3Content } from './Scene3';
import { Scene4 } from './Scene4';
import { Scene5 } from './Scene5';
import { Scene6 } from './Scene6';
import { Scene7 } from './Scene7';
import { NewspaperDive } from './NewspaperDive';
import { AnamorphicWhipPan } from '../Episode3/AnamorphicWhipPan';
import { BurnThroughFakeOner } from './BurnThroughFakeOner';

// ─────────────────────────────────────────────────────────
// MASTER EPISODE 4 TIMELINE
//
// Scene 1:  0  – 720  (24s — Hook + 1300 Signatures + internal WhipPan to B-Roll)
// Scene 2: 720 – 1380 (22s — Rogue Agent CRT pull-out + Paper Engine + CEO)
//
// The transition is NOT an extra whip pan here.
// Scene 1 ends on the full-screen B-Roll (ServerFarmScene).
// Scene 2 begins with the exact same B-Roll playing on the CRT monitor
// and pulls back slowly (Slow Anamorphic Pull-Out per the master script).
// Continuity is visual, not a hard cut.
//
// Total: 1380 frames at 30fps = 46 seconds
// ─────────────────────────────────────────────────────────

export const SCENE1_DURATION = 720;
export const SCENE2_DURATION = 864; // Shortened to hit exactly 00:52.24 (cutting out Mazen's dead air)
export const SCENE3_DURATION = 588 + 120; // 273 (Mariya) + 102 (Mariya 4) + 213 (Mazen) + 120 (Cinematic Pause)
export const SCENE4_DURATION = 1148; // Adjusted precisely so that the transition hits 1 second later to let the text breathe
export const SCENE5_DURATION = 630; // 21 seconds total (10s chunk1 + 11s chunk2)
export const SCENE6_DURATION = 1071; // Trimmed 1 second so the next wipe hits exactly 02:51.11 (global frame 5141)
export const SCENE7_DURATION = 600; // 18s VO + trailing padding for the outro
export const WIPE_2_TO_3_START = SCENE1_DURATION + SCENE2_DURATION;
export const WIPE_2_TO_3_END = WIPE_2_TO_3_START + 18;
export const WIPE_3_TO_4_START = SCENE1_DURATION + SCENE2_DURATION + SCENE3_DURATION;
export const WIPE_4_TO_5_START = WIPE_3_TO_4_START + SCENE4_DURATION;
export const WIPE_5_TO_6_START = WIPE_4_TO_5_START + SCENE5_DURATION;
export const WIPE_6_TO_7_START = WIPE_5_TO_6_START + SCENE6_DURATION;
export const EPISODE4_DURATION = SCENE1_DURATION + SCENE2_DURATION + SCENE3_DURATION + SCENE4_DURATION + SCENE5_DURATION + SCENE6_DURATION + SCENE7_DURATION;

const GlobalTexture: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", zIndex: 999, mixBlendMode: "overlay", opacity: 0.05 }}>
    <div style={{ width: "100%", height: "100%", backgroundImage: `url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23n)"/></svg>')` }} />
  </AbsoluteFill>
);

const DioramaOverlay: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", zIndex: 90, mixBlendMode: "multiply" }}>
    <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, #1a1a1a 1px, transparent 1px)", backgroundSize: "5px 5px", opacity: 0.25 }} />
  </AbsoluteFill>
);

export const Episode4: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#020202", overflow: "hidden" }}>

      {/* ── SCENE 1 (0 – 720) — has its own Audio internally ── */}
      <Sequence from={0} durationInFrames={SCENE1_DURATION}>
        <Episode4Scene1 />
      </Sequence>

      {/* ── SCENE 2 AND SCENE 3 TRANSITION ── */}
      <AbsoluteFill style={{ zIndex: 10 }}>
        <AnamorphicWhipPan
          transitionStartFrame={WIPE_2_TO_3_START}
          durationFrames={18}
          caColorA="rgba(255, 51, 51, 0.2)" // War Room Red
          caColorB="rgba(255, 0, 85, 0.2)"  // Mariya Magenta
          flareColor="rgba(255, 0, 85, 0.6)"
          childrenA={
            <Sequence from={SCENE1_DURATION} durationInFrames={SCENE2_DURATION + 150}>
              <Audio src={staticFile('audio/episode4/scene2/scene2_episode4.mp3')} endAt={494} />

              <Sequence from={567} durationInFrames={62}>
                <Audio src={staticFile('audio/episode4/scene2/scene2_episode4.mp3')} startFrom={494} />
              </Sequence>

              <Sequence from={752}>
                <Audio src={staticFile('audio/episode4/scene2/scene2_episode4.mp3')} startFrom={556} />
              </Sequence>

              <Scene2Content />
            </Sequence>
          }
          childrenB={
            <Sequence from={WIPE_2_TO_3_START} durationInFrames={SCENE3_DURATION + 150}>
              {/* Scene 3 Audio - Detached at 00:57.13 (Frame 43) for a 3-second pause */}
              <Audio src={staticFile('audio/episode4/scene3/mariya-pose1-2-3-scene3.mp3')} endAt={43} />

              <Sequence from={43 + 90}>
                <Audio src={staticFile('audio/episode4/scene3/mariya-pose1-2-3-scene3.mp3')} startFrom={43} />
              </Sequence>

              <Sequence from={273 + 90}>
                <Audio src={staticFile('audio/episode4/scene3/mariya-pose4-scene3.mp3')} />
              </Sequence>

              <Sequence from={273 + 102 + 90}>
                <Audio src={staticFile('audio/episode4/scene3/mazen-pose1-2-3-scene3.mp3')} />
              </Sequence>
              {(() => {
                const f = useCurrentFrame() - WIPE_2_TO_3_START;
                const NEWSPAPER_START = 22; // 00:56.22 exactly
                const NEWSPAPER_EXIT = 22 + 45; // 1.5 seconds later (1 sec earlier than before)

                // The Match Cut: Studio spins wildly on Z-axis (-720deg) and scales past camera (scale 4)
                const studioWhipOut = spring({ frame: Math.max(0, f - NEWSPAPER_START), fps: 30, config: { damping: 14, stiffness: 120 } });
                const studioWhipIn = spring({ frame: Math.max(0, f - NEWSPAPER_EXIT), fps: 30, config: { damping: 20, stiffness: 60 } }); // Softer, smoother return
                const studioProgress = studioWhipOut - studioWhipIn;

                // CRITICAL FIX: Only spin the studio on the way OUT. On the way IN, it stays at -720 (which is upright). 
                // This prevents the black background from showing at the corners while it scales down.
                const studioRotZ = interpolate(studioWhipOut, [0, 1], [0, -720]);
                const studioScale = interpolate(studioProgress, [0, 1], [1, 4]); // Studio pushes massively past camera

                const isReturning = f > NEWSPAPER_EXIT;
                const studioBlur = interpolate(studioProgress, [0, 0.5, 1], [0, isReturning ? 60 : 30, 0]); // Double the blur on return

                return (
                  <>
                    <AbsoluteFill style={{
                      transform: `scale(${studioScale}) rotateZ(${studioRotZ}deg)`,
                      transformOrigin: 'center center',
                      filter: `blur(${studioBlur}px)`,
                      opacity: studioProgress > 0.95 ? 0 : 1 // Hide when fully spun to save GPU
                    }}>
                      <Scene3Content />
                    </AbsoluteFill>

                    <NewspaperDive startFrame={NEWSPAPER_START} exitFrame={NEWSPAPER_EXIT} />
                  </>
                );
              })()}
            </Sequence>
          }
        />
      </AbsoluteFill>

      {/* ── MASTER TRANSITION CHAIN (SCENE 3 -> SCENE 4 -> SCENE 5) ── */}
      <AbsoluteFill style={{ zIndex: 20 }}>
        <BurnThroughFakeOner
          transitionStartFrame={WIPE_3_TO_4_START}
          durationFrames={30}
          childrenA={
            <Sequence from={WIPE_2_TO_3_START} durationInFrames={SCENE3_DURATION + 30}>
              {/* Scene 3 continues rendering underneath so we can melt it */}
              <AbsoluteFill>
                  <Scene3Content /> 
              </AbsoluteFill>
            </Sequence>
          }
          childrenB={
            // Scene 4 must be inside the Whip Pan so that when it transitions to Scene 5, Scene 4 physically whips away!
            <AnamorphicWhipPan
              transitionStartFrame={WIPE_4_TO_5_START}
              durationFrames={15}
              caColorA="rgba(0, 229, 204, 0.2)" // Cyan
              caColorB="rgba(0, 229, 204, 0.2)" // Cyan
              flareColor="rgba(0, 229, 204, 0.6)"
              childrenA={
                <Sequence from={WIPE_3_TO_4_START} durationInFrames={SCENE4_DURATION + 150}>
                  <Scene4 />
                </Sequence>
              }
              childrenB={
                <AnamorphicWhipPan
                  transitionStartFrame={WIPE_5_TO_6_START}
                  durationFrames={18}
                  caColorA="rgba(255, 0, 85, 0.2)" // Magenta from Scene 5
                  caColorB="rgba(0, 229, 204, 0.2)" // Cyan for Scene 6
                  flareColor="rgba(255, 0, 85, 0.6)"
                  childrenA={
                    <Sequence from={WIPE_4_TO_5_START} durationInFrames={SCENE5_DURATION + 150}>
                      <Scene5 />
                    </Sequence>
                  }
                  childrenB={
                    <AnamorphicWhipPan
                      transitionStartFrame={WIPE_6_TO_7_START}
                      durationFrames={18}
                      caColorA="rgba(0, 229, 204, 0.2)" // Cyan from Scene 6
                      caColorB="rgba(255, 0, 85, 0.2)" // Mariya Magenta for Scene 7
                      flareColor="rgba(255, 0, 85, 0.6)"
                      childrenA={
                        <Sequence from={WIPE_5_TO_6_START} durationInFrames={SCENE6_DURATION + 150}>
                          {/* Scene 6 Audio Tracks */}
                          <Audio src={staticFile('audio/episode4/scene6/maria-first chunk-scene6.mp3')} />
                          <Sequence from={240}> {/* 8 seconds delay */}
                            <Audio src={staticFile('audio/episode4/scene6/maria-second chunk-scene6.mp3')} />
                          </Sequence>
                          <Sequence from={465}> {/* Shifted to exactly follow Mariya's second chunk */}
                            <Audio src={staticFile('audio/episode4/scene6/mazen-chunk-scene-6.mp3')} />
                          </Sequence>
                          <AbsoluteFill style={{ zIndex: 30 }}>
                            <Scene6 />
                          </AbsoluteFill>
                        </Sequence>
                      }
                      childrenB={
                        <Sequence from={WIPE_6_TO_7_START} durationInFrames={SCENE7_DURATION}>
                          <Scene7 />
                        </Sequence>
                      }
                    />
                  }
                />
              }
            />
          }
        />
      </AbsoluteFill>

      <DioramaOverlay />
      <GlobalTexture />
    </AbsoluteFill>
  );
};
