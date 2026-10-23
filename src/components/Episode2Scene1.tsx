'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

// Scene 1: The Hook (0:00 - 0:10)
// Mazen slides in → Cyan brush wipe → Background revealed → Arabic text snaps in
export default function Episode2Scene1() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mazenRef = useRef<HTMLDivElement>(null);
  const brushRef = useRef<SVGSVGElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const textLine1Ref = useRef<HTMLDivElement>(null);
  const textLine2Ref = useRef<HTMLDivElement>(null);
  const episodeBadgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // ─── 0.0s: Scene starts, background is already visible with Ken Burns ───
      gsap.to(bgRef.current, {
        scale: 1.08,
        duration: 10,
        ease: 'none',
        transformOrigin: 'center center',
      });

      // ─── 0.0s: Episode badge snaps in from top ───
      tl.fromTo(
        episodeBadgeRef.current,
        { y: -60, opacity: 0, rotate: -3 },
        { y: 0, opacity: 1, rotate: 0, duration: 0.3, ease: 'back.out(2)' },
        0
      );

      // ─── 0.2s: Mazen slides aggressively from right ───
      tl.fromTo(
        mazenRef.current,
        { x: '100vw', rotate: 4, opacity: 1 },
        { x: '0vw', rotate: -1, duration: 0.4, ease: 'power4.out' },
        0.2
      );

      // ─── 0.6s: Brush stroke SVG wipes left to right in 0.5s ───
      tl.fromTo(
        '#brush-path',
        { strokeDashoffset: 2000 },
        { strokeDashoffset: 0, duration: 0.5, ease: 'power3.inOut' },
        0.6
      );

      // ─── 0.8s: Fill the entire stroke path (reveal the wipe) ───
      tl.to('#brush-fill', { scaleX: 1, duration: 0.3, ease: 'power2.inOut', transformOrigin: 'left center' }, 0.9);

      // ─── 1.1s: Mazen flies off to the left as wipe covers him ───
      tl.to(
        mazenRef.current,
        { x: '-110vw', rotate: -6, duration: 0.25, ease: 'power4.in', opacity: 0 },
        1.0
      );

      // ─── 1.3s: Wipe dissolves away, revealing background ───
      tl.to('#brush-fill', { opacity: 0, duration: 0.3, ease: 'power2.out' }, 1.25);
      tl.to('#brush-path', { opacity: 0, duration: 0.2 }, 1.35);

      // ─── 1.5s: Arabic text line 1 snaps in aggressively ───
      tl.fromTo(
        textLine1Ref.current,
        { y: 40, opacity: 0, skewX: -5 },
        { y: 0, opacity: 1, skewX: 0, duration: 0.25, ease: 'back.out(3)' },
        1.5
      );

      // ─── 1.75s: Arabic text line 2 snaps in ───
      tl.fromTo(
        textLine2Ref.current,
        { y: 40, opacity: 0, skewX: -5 },
        { y: 0, opacity: 1, skewX: 0, duration: 0.25, ease: 'back.out(3)' },
        1.75
      );

      // ─── 9.0s: Text fades out before next scene transition ───
      tl.to([textLine1Ref.current, textLine2Ref.current], {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: 'power2.in',
      }, 9.0);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="scene1-container"
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16/9',
        overflow: 'hidden',
        backgroundColor: '#0a0a14',
        fontFamily: "'Cairo', sans-serif",
      }}
    >
      {/* ── Global Halftone Noise Overlay (The Vox Secret Weapon) ── */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="vox-halftone">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" result="noise" />
            <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
            <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="blend" />
            <feComposite in="blend" in2="SourceGraphic" operator="in" />
          </filter>

          {/* Chroma-key filter to remove the exact cyan (#00B5AD / teal) from Mazen's background */}
          <filter id="remove-cyan" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      -8 12 -8 20 -14"
              result="alphaMask"
            />
            <feComposite in="SourceGraphic" in2="alphaMask" operator="in" />
          </filter>
        </defs>
      </svg>

      {/* ── Background Still (Ken Burns zoom applied via GSAP) ── */}
      <div
        ref={bgRef}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/first-still.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transformOrigin: 'center center',
          filter: 'url(#vox-halftone)',
        }}
      />

      {/* ── Dark vignette overlay for contrast ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
        pointerEvents: 'none',
        zIndex: 2,
      }} />

      {/* ── Mazen character — sits on a teal background, isolated via CSS ── */}
      <div
        ref={mazenRef}
        style={{
          position: 'absolute',
          bottom: 0,
          right: '2%',
          height: '90%',
          width: '45%',
          zIndex: 10,
          overflow: 'hidden',
          transformOrigin: 'bottom right',
          transform: 'translateX(110vw)',
        }}
      >
        <img
          src="/mazen.jpeg"
          alt="Mazen"
          style={{
            height: '100%',
            width: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            filter: 'contrast(1.05) saturate(1.1)',
          }}
        />
      </div>

      {/* ── Cyan SVG Brush Stroke Wipe ── */}
      <svg
        ref={brushRef}
        viewBox="0 0 1600 900"
        preserveAspectRatio="none"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 20,
          pointerEvents: 'none',
        }}
      >
        {/* The animated stroke path that draws itself */}
        <path
          id="brush-path"
          d="M -50 450 Q 400 380 800 460 Q 1200 540 1650 420"
          fill="none"
          stroke="#00E5CC"
          strokeWidth="340"
          strokeLinecap="round"
          strokeDasharray="2000"
          strokeDashoffset="2000"
          opacity="1"
        />
        {/* The solid fill rectangle that covers the full screen during wipe */}
        <rect
          id="brush-fill"
          x="0" y="0"
          width="1600" height="900"
          fill="#00E5CC"
          style={{ transformOrigin: 'left center', transform: 'scaleX(0)' }}
        />
      </svg>

      {/* ── Arabic Kinetic Typography ── */}
      <div style={{
        position: 'absolute',
        bottom: '8%',
        left: 0,
        right: 0,
        padding: '0 5%',
        zIndex: 30,
        direction: 'rtl',
        textAlign: 'right',
      }}>
        {/* Line 1 */}
        <div
          ref={textLine1Ref}
          style={{
            fontFamily: "'Cairo', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(1.4rem, 4vw, 3.2rem)',
            color: '#FFFFFF',
            lineHeight: 1.2,
            textShadow: '3px 3px 0 #000, -1px -1px 0 #000',
            opacity: 0,
            display: 'inline-block',
            background: 'rgba(0,0,0,0.7)',
            padding: '0.2em 0.5em',
            marginBottom: '0.3em',
          }}
        >
          لو فاكر إن وظيفتك أو شركتك في أمان من الذكاء الاصطناعي...
        </div>

        {/* Line 2 */}
        <div
          ref={textLine2Ref}
          style={{
            fontFamily: "'Cairo', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(1.6rem, 4.5vw, 3.6rem)',
            color: '#00E5CC',
            lineHeight: 1.2,
            textShadow: '3px 3px 0 #000, -1px -1px 0 #000',
            opacity: 0,
            display: 'inline-block',
            padding: '0.2em 0',
          }}
        >
          فأنت في خطر حقيقي.
        </div>
      </div>

      {/* ── Episode Badge ── */}
      <div
        ref={episodeBadgeRef}
        style={{
          position: 'absolute',
          top: '5%',
          right: '4%',
          background: '#FF2D55',
          color: '#fff',
          fontFamily: "'Cairo', sans-serif",
          fontWeight: 700,
          fontSize: 'clamp(0.7rem, 1.5vw, 1rem)',
          padding: '0.3em 0.8em',
          letterSpacing: '0.05em',
          zIndex: 40,
          opacity: 0,
          transform: 'rotate(-2deg)',
          boxShadow: '3px 3px 0 #000',
        }}
      >
        الحلقة ٢ • نشرة الذكاء الاصطناعي
      </div>
    </div>
  );
}
