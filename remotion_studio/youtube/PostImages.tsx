import React from 'react';
import { AbsoluteFill } from 'remotion';

// ── COLOR SYSTEM ──
const CYAN = '#00f2fe';
const GOLD = '#ffb800';
const WHITE = '#ffffff';
const DARK_BG = '#07090e';
const CARD_BG = 'rgba(15, 23, 42, 0.82)';
const MUTED = '#94a3b8';

const FontStyles: React.FC = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=JetBrains+Mono:wght@500;700;800&display=swap');
    * { box-sizing: border-box; }
  `}</style>
);

// ══════════════════════════════════════════════════════════════════════════════
// POST 1: MINIMALIST HIGH-CONTRAST DARK CARD (Amit Singal Hook Style)
// ══════════════════════════════════════════════════════════════════════════════
export const PostMinimalistDark: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: DARK_BG,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '90px 80px',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <FontStyles />

      {/* Subtle Background Grid & Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          opacity: 0.8,
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 242, 254, 0.07) 0%, transparent 70%)',
          filter: 'blur(90px)',
          pointerEvents: 'none'
        }}
      />

      {/* Top Header Row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10,
          direction: 'rtl'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: CYAN,
              boxShadow: `0 0 16px ${CYAN}`
            }}
          />
          <span
            style={{
              fontFamily: 'Cairo',
              fontSize: 28,
              fontWeight: 900,
              color: WHITE,
              letterSpacing: 0.5
            }}
          >
            حرفين ولكن
          </span>
          <span
            style={{
              fontFamily: 'Cairo',
              fontSize: 20,
              fontWeight: 700,
              color: MUTED
            }}
          >
            // هندسة الذكاء الاصطناعي
          </span>
        </div>

        <div
          style={{
            padding: '8px 22px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: `1px solid ${CYAN}55`,
            borderRadius: 50,
            fontFamily: 'JetBrains Mono',
            fontSize: 18,
            fontWeight: 800,
            color: CYAN
          }}
        >
          HARFEN W LAKEN
        </div>
      </div>

      {/* Center High-Impact Typography Hook */}
      <div
        style={{
          zIndex: 10,
          direction: 'rtl',
          textAlign: 'center',
          maxWidth: 920,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 32
        }}
      >
        <h1
          style={{
            fontFamily: 'Cairo',
            fontSize: 54,
            fontWeight: 900,
            color: WHITE,
            lineHeight: 1.4,
            margin: 0
          }}
        >
          90% من الناس بيضيعوا ساعات عشان يثبتوا ملامح نفس الشخصية في الذكاء الاصطناعي..
        </h1>

        <div
          style={{
            height: 3,
            width: 140,
            background: `linear-gradient(90deg, transparent, ${CYAN}, transparent)`,
            margin: '0 auto'
          }}
        />

        <p
          style={{
            fontFamily: 'Cairo',
            fontSize: 44,
            fontWeight: 800,
            color: '#cbd5e1',
            lineHeight: 1.45,
            margin: 0
          }}
        >
          السر مش في 10 خطوات ولا برومبتس معقدة.
          <br />
          السر كله في{' '}
          <span
            style={{
              color: CYAN,
              textShadow: `0 0 25px ${CYAN}88`,
              borderBottom: `3px solid ${CYAN}`
            }}
          >
            هيكل هندسي واحد بـ 4 عناصر بس
          </span>{' '}
          👇
        </p>
      </div>

      {/* Bottom Footer Row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10,
          direction: 'rtl',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: 35
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}
        >
          <div
            style={{
              padding: '10px 24px',
              background: 'rgba(0, 242, 254, 0.1)',
              border: `1px solid ${CYAN}66`,
              borderRadius: 14,
              fontFamily: 'Cairo',
              fontSize: 20,
              fontWeight: 800,
              color: CYAN
            }}
          >
            الكاروسيل والشرح الكامل بالرابط أعلاه ➔
          </div>
        </div>

        <div
          style={{
            fontFamily: 'JetBrains Mono',
            fontSize: 18,
            fontWeight: 700,
            color: MUTED
          }}
        >
          @HarfenWLaken • facebook.com/harfenwlaken
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// POST 2: VIBRANT RESOURCE / VIRAL CARD (Ahmed El-Awadi Conversational Style)
// ══════════════════════════════════════════════════════════════════════════════
export const PostResourceGlow: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#06070a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 60,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <FontStyles />

      {/* Ambient Cybernetic Lights */}
      <div
        style={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 242, 254, 0.18) 0%, transparent 70%)',
          filter: 'blur(80px)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -100,
          left: -100,
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 184, 0, 0.14) 0%, transparent 70%)',
          filter: 'blur(80px)'
        }}
      />

      {/* Main Glass Card Frame */}
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1.5px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 36,
          backdropFilter: 'blur(30px)',
          boxShadow: '0 30px 100px rgba(0, 0, 0, 0.8), 0 0 60px rgba(0, 242, 254, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 70px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Top Floating Badge Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            direction: 'rtl'
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 24px',
              background: 'rgba(255, 184, 0, 0.12)',
              border: `1px solid ${GOLD}66`,
              borderRadius: 50
            }}
          >
            <span style={{ fontSize: 22 }}>🚀</span>
            <span
              style={{
                fontFamily: 'Cairo',
                fontSize: 22,
                fontWeight: 900,
                color: GOLD
              }}
            >
              شيت عملي مجاني متاح الآن
            </span>
          </div>

          <div
            style={{
              fontFamily: 'Cairo',
              fontSize: 24,
              fontWeight: 900,
              color: WHITE,
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: CYAN,
                boxShadow: `0 0 10px ${CYAN}`
              }}
            />
            حرفين ولكن
          </div>
        </div>

        {/* Conversational Punch Hook */}
        <div
          style={{
            direction: 'rtl',
            textAlign: 'right',
            display: 'flex',
            flexDirection: 'column',
            gap: 28
          }}
        >
          <h2
            style={{
              fontFamily: 'Cairo',
              fontSize: 50,
              fontWeight: 900,
              color: WHITE,
              lineHeight: 1.42,
              margin: 0
            }}
          >
            الكاروسيل ده 👇 لسه نازل حالا..
            <br />
            وفيه فك شفرة تثبيت الشخصيات في{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #00f2fe, #38ef7d)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 900
              }}
            >
              Flux و Midjourney
            </span>
            <br />
            ببرومبت معياري واحد مجاناً.
          </h2>

          <div
            style={{
              padding: '24px 30px',
              background: 'rgba(255, 255, 255, 0.04)',
              borderRight: `6px solid ${GOLD}`,
              borderRadius: 18
            }}
          >
            <p
              style={{
                fontFamily: 'Cairo',
                fontSize: 34,
                fontWeight: 800,
                color: '#e2e8f0',
                lineHeight: 1.4,
                margin: 0
              }}
            >
              لو بتعمل محتوى أو إعلانات للعملاء،
              <br />
              الشيت ده هيوفر عليك أيام تجارب وتوهان وفلوس اشتراكات بتضيع في الهوا.
            </p>
          </div>
        </div>

        {/* Bottom Interactive Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            direction: 'rtl',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: 30
          }}
        >
          <div
            style={{
              fontFamily: 'Cairo',
              fontSize: 24,
              fontWeight: 900,
              color: GOLD,
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}
          >
            <span>اضغط على رابط الكاروسيل في البوست لتصفحه فوراً</span>
            <span style={{ fontSize: 26 }}>➔</span>
          </div>

          <div
            style={{
              fontFamily: 'JetBrains Mono',
              fontSize: 18,
              fontWeight: 700,
              color: MUTED
            }}
          >
            Harfen w Laken • 2026
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
