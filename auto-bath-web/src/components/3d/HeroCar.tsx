'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useGLTF, Html } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';

// Added global activeHotspot state to ensure mobile perfection
function Hotspot({ id, position, label, price, activeHotspot, setActiveHotspot }: { id: string, position: [number, number, number], label: string, price: string, activeHotspot: string | null, setActiveHotspot: (id: string | null) => void }) {
  const isActive = activeHotspot === id;

  const portalRef = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    portalRef.current = document.getElementById('popup-root') || document.body;
    setMounted(true);
  }, []);

  return (
    <mesh 
      position={position} 
      // Desktop Hover opens it
      onPointerOver={(e) => { 
        e.stopPropagation(); 
        setActiveHotspot(id);
        document.body.style.cursor = 'pointer'; 
      }} 
      // Desktop Mouse Leave closes it
      onPointerOut={() => { 
        setActiveHotspot(null);
        document.body.style.cursor = 'auto'; 
      }}
      // Bulletproof Mobile Tap forces a toggle
      onClick={(e) => {
        e.stopPropagation();
        setActiveHotspot(isActive ? null : id);
      }}
      scale={isActive ? 1.2 : 1}
    >
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
          <div className="bg-vantablack/90 backdrop-blur-xl border border-electric-cyan/50 px-5 py-3 rounded-xl shadow-[0_0_30px_rgba(0,194,212,0.6)] pointer-events-none whitespace-nowrap animate-in fade-in zoom-in duration-200">
            <h3 className="text-electric-cyan font-heading font-bold text-[13px] uppercase tracking-wider drop-shadow-md">{label}</h3>
            <p className="text-white text-xs font-mono mt-1 opacity-90">{price}</p>
          </div>
        </Html>
      )}
    </mesh>
  );
}

function Lamborghini({ activeHotspot, setActiveHotspot }: { activeHotspot: string | null, setActiveHotspot: (id: string | null) => void }) {
  const { scene } = useGLTF('/free_lamborghini_revuelto.glb');
  
  return (
    <>
      <primitive 
        object={scene} 
        scale={1.3} 
        position={[0, -1.0, 0]} 
        rotation={[0, -Math.PI / 6, 0]} 
      />

      <group scale={1.3} position={[0, -1.0, 0]} rotation={[0, -Math.PI / 6, 0]}>
        <Hotspot id="hood" position={[0, 0.8, 1.8]} label="Ceramic Coating" price="FROM $1,200" activeHotspot={activeHotspot} setActiveHotspot={setActiveHotspot} />
        <Hotspot id="wheel" position={[-1.2, 0.4, 1.1]} label="Alloy Restoration" price="FROM $300" activeHotspot={activeHotspot} setActiveHotspot={setActiveHotspot} />
        <Hotspot id="glass" position={[0, 0.9, 0.9]} label="Hydrophobic Glass" price="FROM $150" activeHotspot={activeHotspot} setActiveHotspot={setActiveHotspot} />
      </group>
    </>
  );
}

useGLTF.preload('/free_lamborghini_revuelto.glb');

export default function HeroCar() {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const isInteracting = activeHotspot !== null;

  return (
    <div className="absolute inset-0 w-full h-full z-0">
      <Canvas 
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, logarithmicDepthBuffer: true }}
        camera={{ position: [0, 1.5, 7], fov: 45 }}
        // Bulletproof Mobile Close: Tapping ANYWHERE on the background canvas instantly closes all popups and resumes car rotation
        onPointerMissed={() => setActiveHotspot(null)}
      >
        <Suspense fallback={null}>
          <Environment preset="studio" background={false} />
          
          <ambientLight intensity={2} />
          <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} intensity={300} color="#ffffff" />
          <pointLight position={[-10, 5, -10]} intensity={200} color="#00C2D4" />

          <Lamborghini activeHotspot={activeHotspot} setActiveHotspot={setActiveHotspot} />

          <ContactShadows position={[0, -1.5, 0]} opacity={0.9} scale={20} blur={3} far={4} color="#00C2D4" />

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
