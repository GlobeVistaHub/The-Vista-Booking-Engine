import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

// ─── THE VOX GRID ─────────────────────────────────────────────────────────────
// A slow-moving architectural dot/line grid that gives the scene depth
export const GridLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const panX = interpolate(frame, [0, 300], [0, 50]);
  const panY = interpolate(frame, [0, 300], [0, 50]);

  return (
    <div style={{
      position: 'absolute', inset: -100,
      backgroundImage: `
        linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
      `,
      backgroundSize: '40px 40px',
      transform: `translate(${panX}px, ${panY}px)`,
      zIndex: 1,
    }} />
  );
};

// ─── ABSTRACT CIRCUIT (For AI / Tech Scenes) ──────────────────────────────────
export const CircuitBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const rotate = interpolate(frame, [0, 600], [0, 10]);
  const scale = interpolate(frame, [0, 300], [1, 1.1]);

  return (
    <svg 
      viewBox="0 0 24 24" 
      style={{
        position: 'absolute', width: '150%', height: '150%', 
        left: '-25%', top: '-25%',
        opacity: 0.08, zIndex: 2,
        transform: `rotate(${rotate}deg) scale(${scale})`,
        stroke: '#FFFFFF', strokeWidth: 0.2, fill: 'none'
      }}
    >
      <path d="M12 2v20M2 12h20M16 4l-4 4-4-4M4 16l4-4 4 4" />
      <circle cx="12" cy="12" r="3" />
      <circle cx="16" cy="4" r="1" />
      <circle cx="8" cy="4" r="1" />
      <circle cx="4" cy="16" r="1" />
      <circle cx="20" cy="16" r="1" />
    </svg>
  );
};

// ─── SERVER STACK (For OpenAI / Data Center Scenes) ───────────────────────────
export const ServerBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const panY = interpolate(frame, [0, 300], [0, -50]);

  return (
    <svg 
      viewBox="0 0 24 24" 
      style={{
        position: 'absolute', width: '120%', height: '120%', 
        left: '-10%', top: '-10%',
        opacity: 0.08, zIndex: 2,
        transform: `translateY(${panY}px)`,
        stroke: '#FFFFFF', strokeWidth: 0.5, fill: 'none'
      }}
    >
      <rect x="2" y="2" width="20" height="6" rx="2" />
      <rect x="2" y="10" width="20" height="6" rx="2" />
      <rect x="2" y="18" width="20" height="6" rx="2" />
      <path d="M6 5h.01M6 13h.01M6 21h.01M10 5h8M10 13h8M10 21h8" />
    </svg>
  );
};

// ─── GLOBE / WORLD (For China / Global Scenes) ────────────────────────────────
export const GlobeBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const rotate = interpolate(frame, [0, 300], [0, -15]);

  return (
    <svg 
      viewBox="0 0 24 24" 
      style={{
        position: 'absolute', width: '140%', height: '140%', 
        right: '-20%', top: '-20%',
        opacity: 0.08, zIndex: 2,
        transform: `rotate(${rotate}deg)`,
        stroke: '#FFFFFF', strokeWidth: 0.4, fill: 'none'
      }}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      <path d="M2 12h20" />
      <path d="M3.5 17h17" />
      <path d="M3.5 7h17" />
    </svg>
  );
};
