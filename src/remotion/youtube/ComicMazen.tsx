import {
  AbsoluteFill,
  Sequence,
  Video,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import React from 'react';

// Reusable 3D Comic Bubble Component
const ComicBubble: React.FC<{ text: string; top?: number; bottom?: number; colorVariant?: 'cyan' | 'magenta' }> = ({ text, top, bottom, colorVariant = 'cyan' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgColor = colorVariant === 'cyan' ? '#00FFFF' : '#FF00FF';
  const shadowColor = colorVariant === 'cyan' ? '#FF00FF' : '#00FFFF';

  // Restore the bouncy spring, but with higher damping and mass for a solid stop
  const rawScale = spring({
    frame,
    fps,
    config: {
      damping: 14,
      stiffness: 200,
      mass: 0.8
    },
  });

  // Limit to 3 decimal places to completely eliminate sub-pixel micro-jitter at resting state
  const scale = Number(rawScale.toFixed(3));

  // Add back a very subtle, one-time smooth swing to keep it lively (no repeating wiggle)
  const rotation = interpolate(frame, [0, 15, 30], [-4, 2, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: top ? 'flex-start' : (bottom ? 'flex-end' : 'center'),
        alignItems: 'center',
        paddingTop: top ? `${top}px` : '0px',
        paddingBottom: bottom ? `${bottom}px` : '0px',
      }}
    >
      <div
        style={{
          transform: `scale(${scale}) rotate(${rotation}deg) translateZ(0)`,
          backfaceVisibility: 'hidden',
          WebkitFontSmoothing: 'antialiased',
          willChange: 'transform',
          backgroundColor: bgColor,
          color: '#000',
          padding: '30px 50px',
          borderRadius: '30px',
          border: '8px solid #000',
          boxShadow: `15px 15px 0px ${shadowColor}`,
          fontSize: '65px',
          fontFamily: '"Cairo", "Tajawal", sans-serif',
          fontWeight: '900',
          textAlign: 'center',
          maxWidth: '80%',
          direction: 'rtl',
          position: 'relative',
          lineHeight: '1.4',
        }}
      >
        {text}
        
        {/* Comic Bubble Tail */}
        <div
          style={{
            position: 'absolute',
            bottom: '-35px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '0',
            height: '0',
            borderLeft: '20px solid transparent',
            borderRight: '20px solid transparent',
            borderTop: '35px solid #000',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-22px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '0',
            height: '0',
            borderLeft: '12px solid transparent',
            borderRight: '12px solid transparent',
            borderTop: `25px solid ${bgColor}`,
            zIndex: 2,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

export const ComicMazen: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {/* Base Video Layer */}
      <AbsoluteFill>
        <Video 
          src={staticFile("youtube-assets/commic-mazen-1.mp4")} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      </AbsoluteFill>

      {/* Bubble 1: Between two ladies (Disappear @ 00:01:21 + 0.2s -> Frame 57) */}
      <Sequence from={6} durationInFrames={51}>
        <ComicBubble text="حقك يا عم منت واخد أخبار ال AI مقاولة 😎🗞️🤖" top={200} colorVariant="cyan" />
      </Sequence>

      {/* Bubble 2: Jumps over fence (Disappear @ 00:05:08 + 0.2s -> Frame 164) */}
      <Sequence from={96} durationInFrames={68}>
        <ComicBubble text="مازن اتجنن.. هو ده طبيعى و لا AI?!! 😱🏃‍♂️🤯" bottom={200} colorVariant="magenta" />
      </Sequence>

      {/* Bubble 3: Scores the goal (Disappear @ 00:14:22 + 0.2s -> Frame 448) */}
      <Sequence from={396} durationInFrames={52}>
        <ComicBubble text="الجون ده اتحسب على فكرة بس لحرفين و لكن مش الفريق. ⚽️🥅😂" top={200} colorVariant="cyan" />
      </Sequence>

      {/* Bubble 4: Hailing the crowd (Disappear @ 00:17:22 + 0.2s -> Frame 538) */}
      <Sequence from={486} durationInFrames={52}>
        <ComicBubble text="و مع الجنان ده كله الجمهور فضل يهيص لغاية بالليل 👏🎉🌙" bottom={200} colorVariant="magenta" />
      </Sequence>
    </AbsoluteFill>
  );
};
