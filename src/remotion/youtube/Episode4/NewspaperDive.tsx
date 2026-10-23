import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, staticFile } from 'remotion';

export const NewspaperDive: React.FC<{ startFrame: number, exitFrame: number }> = ({ startFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  const localFrame = Math.max(0, frame - startFrame);

  // Z-Axis Tumbling Spin (Classic Cinematic Newspaper Flight)
  const entryWhip = spring({ frame: localFrame, fps: 30, config: { damping: 14, stiffness: 120 } });
  const exitWhip = spring({ frame: Math.max(0, localFrame - exitFrame), fps: 30, config: { damping: 20, stiffness: 60 } }); 

  // Fast, aggressive pinwheel spin (keeps spinning forward during exit instead of rewinding)
  const rotateZ = interpolate(entryWhip, [0, 1], [720, 0]) + interpolate(exitWhip, [0, 1], [0, -720]); 

  // Enters by growing from 0.01 to 1.6. Exits by blowing PAST the camera (scaling to 10.0)
  const scale = interpolate(entryWhip, [0, 1], [0.01, 1.6]) + interpolate(exitWhip, [0, 1], [0, 8.4]); 
  
  // Fade out right as it hits the camera lens to cleanly reveal the MSFT HUD behind it
  const opacity = entryWhip > 0.02 ? interpolate(exitWhip, [0.5, 1], [1, 0], { extrapolateRight: 'clamp' }) : 0;

  const isReturning = localFrame > exitFrame;
  const blur = interpolate(entryWhip, [0, 0.8, 1], [20, 5, 0]) + interpolate(exitWhip, [0, 0.5, 1], [0, 15, 60]); 

  // Staggered Line-by-Line Highlighter Animation (Vox Style)
  const marker1 = spring({ frame: Math.max(0, localFrame - 25), fps: 30, config: { damping: 16, stiffness: 100 } });
  const marker2 = spring({ frame: Math.max(0, localFrame - 30), fps: 30, config: { damping: 16, stiffness: 100 } });
  const marker3 = spring({ frame: Math.max(0, localFrame - 35), fps: 30, config: { damping: 16, stiffness: 100 } });

  // Authentic Journalistic Text (No more placeholders)
  const articleParagraph1 = "خطوة مفاجئة أثارت قلق الخبراء حول العالم، قامت شركة مايكروسوفت بتسريح كامل فريق الأخلاقيات والمجتمع (Ethics and Society) التابع لقسم الذكاء الاصطناعي. هذا الفريق كان مسؤولاً عن ضمان التزام الشركة بالمبادئ الأخلاقية وتحديد المخاطر المحتملة قبل إطلاق المنتجات التقنية المتطورة.";

  const articleParagraph2 = "يأتي هذا القرار في ظل السباق المحموم للسيطرة على تكنولوجيا الذكاء الاصطناعي، حيث تسعى الشركة لتسريع دمج أدوات OpenAI في منتجاتها متجاهلة التحذيرات الأمنية. وأكدت مصادر داخلية أن القيادة العليا اعتبرت الفريق عقبة أمام الابتكار السريع.";

  const articleParagraph3 = "تسريح هذا الفريق يطرح تساؤلات خطيرة حول مستقبل الذكاء الاصطناعي ومدى التزام الشركات التكنولوجية الكبرى بسلامة البشرية، خاصة في وقت تتسارع فيه قدرات هذه الأنظمة بشكل غير مسبوق وبدون رقابة كافية.";

  const secondaryArticle = "حذر العديد من المهندسين السابقين في الشركة من أن الضغط لإصدار منتجات الذكاء الاصطناعي بسرعة أدى إلى تهميش بروتوكولات الأمان الأساسية. الخوف الحقيقي الآن هو أن التركيز على التفوق التجاري قد فتح الباب أمام تقنيات لا يمكن السيطرة عليها.";

  return (
    <AbsoluteFill style={{
      justifyContent: 'center',
      alignItems: 'center',
      opacity: opacity,
      pointerEvents: 'none',
      zIndex: 2000,
      backgroundColor: `rgba(0,0,0,${interpolate(entryWhip, [0, 1], [0, 0.6]) - interpolate(exitWhip, [0, 1], [0, 0.6])})` 
    }}>

      {/* The Newspaper Object */}
      <div style={{
        width: 1200,
        height: 1400, // True portrait broadsheet size
        backgroundColor: '#e6dfd1', // Darker, more authentic aged newsprint
        transform: `scale(${scale}) rotateZ(${rotateZ}deg)`,
        transformOrigin: 'center center',
        filter: `blur(${blur}px)`,
        boxShadow: '0 30px 100px rgba(0,0,0,0.9), inset 0 0 150px rgba(100, 80, 50, 0.4)', // Heavy depth and vignette
        display: 'flex',
        flexDirection: 'column',
        padding: '60px 50px',
        fontFamily: "'Times New Roman', Times, serif",
        color: '#1a1a1a',
        position: 'relative',
        overflow: 'hidden'
      }}>

        {/* Clean CSS texture until user provides a real image */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)', pointerEvents: 'none', zIndex: 99 }} />

        {/* Middle Eastern Journal Header (Al-Ahram / Asharq Al-Awsat Style) */}
        <div style={{ borderBottom: '4px solid #cc0000', marginBottom: 2 }}>
          <div style={{ borderBottom: '1px solid #111', paddingBottom: 10, marginBottom: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>

            {/* Top red banner / slogan */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', fontSize: 18, fontWeight: 'bold', color: '#cc0000', borderBottom: '1px solid #cc0000', paddingBottom: 5, marginBottom: 20, fontFamily: "'Amiri', serif" }}>
              جريدة سياسية يومية مستقلة
            </div>

            {/* Massive Calligraphy Logo */}
            <div style={{ fontSize: 130, fontWeight: 900, fontFamily: "'Amiri', serif", color: '#111', lineHeight: 0.8, marginBottom: 15 }}>
              التقنية نيوز
            </div>

            {/* Date and Metadata Grid (One week before today) */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 'bold', fontFamily: "'Cairo', sans-serif", borderTop: '2px solid #111', borderBottom: '2px solid #111', padding: '8px 0', marginTop: 10 }}>
              <div style={{ flex: 1, textAlign: 'left', borderRight: '1px solid #111', paddingRight: 10 }}>الثمن ١٥ جنيهاً</div>
              <div style={{ flex: 2, textAlign: 'center', direction: 'rtl' }}>القاهرة - الثلاثاء ٥ صفر ١٤٤٨ هـ الموافق ١٨ أغسطس ٢٠٢٦ م</div>
              <div style={{ flex: 1, textAlign: 'right', borderLeft: '1px solid #111', paddingLeft: 10 }}>السنة الرابعة - العدد ١٠٤٥</div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 25 }} />

        {/* Newspaper Grid Layout */}
        <div style={{ display: 'flex', gap: 30, flex: 1 }}>

          {/* Main Story Column */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid #ccc', paddingRight: 30 }}>

            {/* Authentic Journalistic Headline with Staggered Vox Highlighters */}
            <div style={{ position: 'relative', fontSize: 60, fontWeight: 900, lineHeight: 1.4, color: '#111', marginBottom: 25, direction: 'rtl', fontFamily: "'Cairo', sans-serif", textAlign: 'right' }}>

              <div style={{ position: 'relative', display: 'inline-block' }}>
                <div style={{ position: 'absolute', right: 0, bottom: '15%', height: '40%', width: `${marker1 * 100}%`, backgroundColor: '#FFEA00', mixBlendMode: 'multiply', transformOrigin: 'right center' }} />
                <span style={{ position: 'relative', zIndex: 10 }}>طرد فريق الأخلاقيات:</span>
              </div>
              <br />
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <div style={{ position: 'absolute', right: 0, bottom: '15%', height: '40%', width: `${marker2 * 100}%`, backgroundColor: '#FFEA00', mixBlendMode: 'multiply', transformOrigin: 'right center' }} />
                <span style={{ position: 'relative', zIndex: 10 }}>هل تخلت مايكروسوفت عن الأمان</span>
              </div>
              <br />
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <div style={{ position: 'absolute', right: 0, bottom: '15%', height: '40%', width: `${marker3 * 100}%`, backgroundColor: '#FFEA00', mixBlendMode: 'multiply', transformOrigin: 'right center' }} />
                <span style={{ position: 'relative', zIndex: 10 }}>من أجل السرعة؟</span>
              </div>

            </div>

            <div style={{ fontSize: 18, fontStyle: 'italic', marginBottom: 15, borderBottom: '1px solid #999', paddingBottom: 10 }}>
              تقرير: قسم التكنولوجيا والأمن السيبراني
            </div>

            {/* True Multi-Column Print Text */}
            <div style={{ columnCount: 2, columnGap: '20px', direction: 'rtl', fontFamily: "'Amiri', serif", fontSize: 18, lineHeight: 1.7, textAlign: 'justify' }}>
              <span style={{ fontSize: 48, float: 'right', lineHeight: 0.8, marginRight: 10, fontWeight: 'bold' }}>فى</span>
              {articleParagraph1}
              <br /><br />
              {articleParagraph2}
              <br /><br />
              {articleParagraph3}
            </div>
          </div>

          {/* Right Side Image & Secondary Story */}
          <div style={{ flex: 0.8, display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: '100%', height: 350, border: '2px solid #222', padding: 4, backgroundColor: '#fff', marginBottom: 10 }}>
              <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>

                <img
                  src={staticFile('images/episode4/scene-3/microsoft-hq.png')}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(70%) contrast(150%) sepia(10%)' }}
                />

                {/* News Agency Watermark Stamp */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', pointerEvents: 'none', zIndex: 5 }}>
                  <div style={{
                    fontSize: 35,
                    fontWeight: 900,
                    fontFamily: "'Amiri', serif",
                    color: 'rgba(255, 255, 255, 0.45)',
                    border: '3px solid rgba(255, 255, 255, 0.3)',
                    padding: '5px 25px',
                    borderRadius: 4,
                    transform: 'rotate(-12deg)',
                    mixBlendMode: 'overlay',
                    letterSpacing: 2
                  }}>
                    التقنية نيوز
                  </div>
                </div>

                {/* Authentic Newspaper Halftone Overlay */}
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '3px 3px', opacity: 0.25, mixBlendMode: 'multiply', zIndex: 10 }} />
              </div>
            </div>

            <div style={{ fontSize: 14, fontWeight: 'bold', fontFamily: "'Arial', sans-serif", borderBottom: '1px solid #ccc', paddingBottom: 10, marginBottom: 15, direction: 'rtl', textAlign: 'right' }}>
              الشكل ١.٠ — مقر مايكروسوفت: مخاوف متزايدة من تهميش فرق السلامة والأمان.
            </div>

            <div style={{ fontSize: 26, fontWeight: 'bold', fontFamily: "'Cairo', sans-serif", marginBottom: 10, textAlign: 'center', borderBottom: '2px solid #222', paddingBottom: 10, direction: 'rtl' }}>
              السباق نحو الهاوية
            </div>

            <div style={{ columnCount: 2, columnGap: '15px', direction: 'rtl', fontFamily: "'Amiri', serif", fontSize: 16, lineHeight: 1.6, textAlign: 'justify' }}>
              {secondaryArticle}
            </div>
          </div>

        </div>
      </div>
    </AbsoluteFill>
  );
};
