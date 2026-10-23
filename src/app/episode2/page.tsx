import Episode2Scene1 from '@/components/Episode2Scene1';

export const metadata = {
  title: 'Episode 2 Preview – AI News | نشرة الذكاء الاصطناعي',
  description: 'Scene 1 preview of the AI News Episode 2 - Mixed Media Collage style',
};

export default function Episode2PreviewPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        gap: '1.5rem',
      }}
    >
      {/* Header */}
      <div style={{
        color: '#00E5CC',
        fontFamily: 'monospace',
        fontSize: '0.85rem',
        letterSpacing: '0.15em',
        opacity: 0.7,
        textTransform: 'uppercase',
      }}>
        Scene 1 Preview — Mixed Media Collage Engine
      </div>

      {/* Player wrapper */}
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        boxShadow: '0 0 80px rgba(0, 229, 204, 0.15), 0 0 0 1px rgba(255,255,255,0.08)',
        borderRadius: '4px',
        overflow: 'hidden',
      }}>
        <Episode2Scene1 />
      </div>

      {/* Reload hint */}
      <p style={{
        color: 'rgba(255,255,255,0.3)',
        fontFamily: 'monospace',
        fontSize: '0.75rem',
      }}>
        Refresh the page to replay the animation sequence
      </p>
    </main>
  );
}
