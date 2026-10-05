'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useGLTF, Html } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';

// Added global activeHotspot state to ensure mobile perfection
function Hotspot({ id, position, label, price, activeHotspot, setActiveHotspot, isMobile }: { id: string, position: [number, number, number], label: string, price: string, activeHotspot: string | null, setActiveHotspot: (id: string | null) => void, isMobile: boolean }) {
  const isActive = activeHotspot === id;

  const portalRef = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    portalRef.current = document.getElementById('popup-root') || document.body;
    setMounted(true);
  }, []);

  return (
    <group position={position} scale={isActive || isHovered ? 1.2 : 1}>
      {/* MASSIVE Invisible Hitbox for Mobile Thumbs */}
      <mesh 
        onClick={(e) => {
          e.stopPropagation();
          setActiveHotspot(isActive ? null : id);
        }}
        onPointerOver={(e) => { 
          e.stopPropagation(); 
          if (!isMobile) setActiveHotspot(id);
          setIsHovered(true);
          document.body.style.cursor = 'pointer'; 
        }} 
        onPointerOut={() => { 
          setIsHovered(false);
          if (!isMobile) setActiveHotspot(null);
          document.body.style.cursor = 'auto'; 
        }}
        visible={false}
      >
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      {/* Visual Ring */}
      <mesh>
        <ringGeometry args={[0.08, 0.12, 32]} />
        <meshBasicMaterial color="#00C2D4" transparent opacity={0.8} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      
      {isActive && mounted && (
        <Html center portal={portalRef as any} zIndexRange={[99999, 99998]}>
          <div className="bg-vantablack/90 backdrop-blur-xl border border-electric-cyan/50 px-3 py-2 md:px-5 md:py-3 rounded-lg md:rounded-xl shadow-[0_0_30px_rgba(0,194,212,0.6)] pointer-events-none whitespace-nowrap animate-in fade-in zoom-in duration-200">
            <h3 className="text-electric-cyan font-heading font-bold text-[9px] md:text-[13px] uppercase tracking-wider drop-shadow-md">{label}</h3>
            <p className="text-white text-[9px] md:text-xs font-mono mt-0.5 md:mt-1 opacity-90">{price}</p>
          </div>
        </Html>
      )}
    </group>
  );
}

function Lamborghini({ activeHotspot, setActiveHotspot, isMobile }: { activeHotspot: string | null, setActiveHotspot: (id: string | null) => void, isMobile: boolean }) {
  const { scene } = useGLTF('/free_lamborghini_revuelto.glb');
  
  const baseScale = isMobile ? 0.9 : 1.3;
  const yOffset = isMobile ? -0.4 : -1.0;
  
  return (
    <>
      <primitive 
        object={scene} 
        scale={baseScale} 
        position={[0, yOffset, 0]} 
        rotation={[0, -Math.PI / 6, 0]} 
      />

      <group scale={baseScale} position={[0, yOffset, 0]} rotation={[0, -Math.PI / 6, 0]}>
        <Hotspot id="hood" position={[0, 0.8, 1.8]} label="Ceramic Coating" price="FROM $1,200" activeHotspot={activeHotspot} setActiveHotspot={setActiveHotspot} isMobile={isMobile} />
        <Hotspot id="wheel" position={[-1.2, 0.4, 1.1]} label="Alloy Restoration" price="FROM $300" activeHotspot={activeHotspot} setActiveHotspot={setActiveHotspot} isMobile={isMobile} />
        <Hotspot id="glass" position={[0, 0.9, 0.9]} label="Hydrophobic Glass" price="FROM $150" activeHotspot={activeHotspot} setActiveHotspot={setActiveHotspot} isMobile={isMobile} />
      </group>
    </>
  );
}

useGLTF.preload('/free_lamborghini_revuelto.glb');

export default function HeroCar() {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const isInteracting = activeHotspot !== null;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full z-0">
      <Canvas 
        style={{ touchAction: 'pan-y' }}
        dpr={isMobile ? 1 : [1, 1.5]}
        gl={{ antialias: !isMobile, alpha: true, logarithmicDepthBuffer: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 1.5, 7], fov: 45 }}
        // Bulletproof Mobile Close: Tapping ANYWHERE on the background canvas instantly closes all popups and resumes car rotation
        onPointerMissed={() => setActiveHotspot(null)}
      >
        <Suspense fallback={null}>
          <Environment preset="studio" background={false} />
          
          <ambientLight intensity={2} />
          <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} intensity={300} color="#ffffff" />
          <pointLight position={[-10, 5, -10]} intensity={200} color="#00C2D4" />

          <Lamborghini activeHotspot={activeHotspot} setActiveHotspot={setActiveHotspot} isMobile={isMobile} />

          <ContactShadows position={[0, -1.5, 0]} opacity={0.9} scale={20} blur={3} far={4} color="#00C2D4" frames={1} resolution={256} />

          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate={!isInteracting}
            autoRotateSpeed={isInteracting ? 0 : 0.5}
            enableDamping={!isInteracting}
            maxPolarAngle={Math.PI / 2 + 0.1}
            minPolarAngle={Math.PI / 3}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
