"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring, MotionValue } from "framer-motion";
import { CodeSnippet } from "@/components/ui/CodeSnippet";
import { useRef, useState, useEffect } from "react";
import Map, { Marker, MapRef, NavigationControl } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import Script from "next/script";

const fadeInUp: any = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] } }
};

const staggerContainer: any = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const kineticText: any = {
  hidden: { opacity: 0, rotateX: -90, y: 50 },
  visible: {
    opacity: 1,
    rotateX: 0,
    y: 0,
    transition: { type: "spring", damping: 15, stiffness: 100 }
  }
};

const CODE_TIMEZONE = `// Secure Timezone Enforcement Matrix
const exactVercelString = \`\${year}-\${month}-\${day}T\${hours}:\${minutes}:00.000Z\`;

let isPastTime = false;
const melbFormatter = new Intl.DateTimeFormat('en-AU', { 
  timeZone: 'Australia/Melbourne', 
  year: 'numeric', month: '2-digit', day: '2-digit', 
  hour: '2-digit', minute: '2-digit', hour12: false 
});
const melbParts = melbFormatter.formatToParts(new Date());

// Absolute prevention of cross-hemisphere timezone desynchronization.
if (sYear === mYear && sMonth === mMonth && sDay === mDay) {
  if (sHour < mHour || (sHour === mHour && sMinute < mMinute)) {
    isPastTime = true;
  }
}`;

const CODE_FINANCE = `// Secure Financial State Machine
const paymentIntent = await stripe.paymentIntents.create({
  amount: service.base_price,
  currency: "aud",
  receipt_email: formData.email,
  metadata: {
    customer_email: formData.email,
    service_name: service.name,
    vehicle: formData.vehicle,
    date: formData.date,
    time: formData.time
  }
});

// Store intent strictly bounded to authenticated Supabase identity
const { error: bookingError } = await supabaseAdmin.from("bookings").insert({
  user_id: userId,
  service_id: service.id,
  scheduled_time: scheduledTime,
  status: "pending",
  stripe_payment_intent_id: paymentIntent.id,
});`;

const CODE_REFUNDS = `// Automated 48-Hour Refund Engine
const scheduledDate = new Date(booking.scheduled_time);
const now = new Date();
const hoursDifference = (scheduledDate.getTime() - now.getTime()) / (1000 * 60 * 60);

// Zero-touch operational compliance
if (hoursDifference >= 48) {
  await stripe.refunds.create({
    payment_intent: booking.stripe_payment_intent_id,
  });
  console.log(\`Refunded payment intent \${booking.stripe_payment_intent_id}\`);
} else {
  console.log(\`No refund issued: Cancellation is within 48 hour window.\`);
}`;

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const LATITUDE = -37.7346;
const LONGITUDE = 144.9194;

const FloatingParticles = () => {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Create smooth parallax layers
  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 20 });
  
  const layer1X = useTransform(smoothX, [-1000, 1000], [-15, 15]);
  const layer1Y = useTransform(smoothY, [-1000, 1000], [-15, 15]);
  
  const layer2X = useTransform(smoothX, [-1000, 1000], [-40, 40]);
  const layer2Y = useTransform(smoothY, [-1000, 1000], [-40, 40]);
  
  const layer3X = useTransform(smoothX, [-1000, 1000], [-80, 80]);
  const layer3Y = useTransform(smoothY, [-1000, 1000], [-80, 80]);

  if (!mounted) return null;

  return (
    <>
      <motion.div className="absolute inset-0 overflow-hidden pointer-events-none z-0 mix-blend-screen" style={{ x: layer1X, y: layer1Y }}>
        {Array.from({ length: 15 }).map((_, i) => (
          <Particle key={`l1-${i}`} />
        ))}
      </motion.div>
      <motion.div className="absolute inset-0 overflow-hidden pointer-events-none z-0 mix-blend-screen" style={{ x: layer2X, y: layer2Y }}>
        {Array.from({ length: 15 }).map((_, i) => (
          <Particle key={`l2-${i}`} />
        ))}
      </motion.div>
      <motion.div className="absolute inset-0 overflow-hidden pointer-events-none z-0 mix-blend-screen" style={{ x: layer3X, y: layer3Y }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <Particle key={`l3-${i}`} />
        ))}
      </motion.div>
    </>
  );
};

const Particle = () => {
  const isCyan = Math.random() > 0.5;
  const size = Math.random() * 3 + 1;
  return (
    <motion.div
      className={`absolute rounded-full ${isCyan ? 'bg-electric-cyan shadow-[0_0_10px_rgba(0,194,212,0.8)]' : 'bg-cyber-orange shadow-[0_0_10px_rgba(255,102,0,0.8)]'}`}
      style={{
        width: size,
        height: size,
        left: Math.random() * 100 + "%",
        top: Math.random() * 100 + "%",
      }}
      animate={{
        y: [0, Math.random() * -150 - 50],
        x: [0, (Math.random() - 0.5) * 100],
        opacity: [0, Math.random() * 0.8 + 0.2, 0],
        scale: [0, Math.random() * 1.5 + 0.5, 0]
      }}
      transition={{
        duration: Math.random() * 8 + 7,
        repeat: Infinity,
        ease: "linear",
        delay: Math.random() * 10,
      }}
    />
  );
};

export function ShowcaseClient() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const mapRef = useRef<MapRef>(null);
  const [currentZoom, setCurrentZoom] = useState(14);

  return (
    <main className="min-h-screen bg-[#050505] selection:bg-electric-cyan/30 selection:text-white relative overflow-hidden font-sans">
      <Script type="module" src="https://unpkg.com/@splinetool/viewer@1.9.7/build/spline-viewer.js" strategy="lazyOnload" />

      {/* Immersive WebGL-inspired Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-electric-cyan/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyber-orange/10 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-24 relative z-10">

        {/* Hero Section */}
        <motion.div
          style={{ y, opacity }}
          className="min-h-[70vh] flex flex-col justify-center mb-32"
        >
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.span variants={fadeInUp} className="inline-block py-1 px-3 rounded-full border border-white/10 bg-white/5 text-white/50 text-xs font-mono uppercase tracking-widest mb-6">
              Goodbrains Studio // Case Study
            </motion.span>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-heading font-bold text-white uppercase tracking-tighter leading-tight mb-8 break-words" style={{ perspective: "1000px" }}>
              <motion.div variants={kineticText} style={{ transformOrigin: "bottom" }}>Engineering</motion.div>
              <motion.div variants={kineticText} style={{ transformOrigin: "bottom" }} className="text-transparent bg-clip-text bg-gradient-to-r from-electric-cyan to-cyber-orange">
                Digital Machines.
              </motion.div>
            </h1>

            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-white/50 max-w-2xl font-light leading-relaxed mb-12">
              We don't just build websites. We architect high-performance SaaS infrastructure, automate complex financial pipelines, and enforce zero-latency global state management.
            </motion.p>
          </motion.div>

          {/* 3D Car Kinetic Embed */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden border border-white/10 relative mt-4 shadow-[0_0_50px_rgba(0,194,212,0.1)] bg-[#0A0A0A]"
          >
            {/* The Atmospheric WebGL Background Particles */}
            <FloatingParticles />

            {/* Native Spline Web Component via dangerouslySetInnerHTML to avoid React TS errors */}
            <div
              className="absolute inset-0 pointer-events-auto mix-blend-screen touch-none"
              dangerouslySetInnerHTML={{
                __html: '<spline-viewer url="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" style="width: 100%; height: 100%;"></spline-viewer>'
              }}
            />
            <div className="absolute top-4 left-4 pointer-events-none z-10">
              <span className="bg-black/50 backdrop-blur-md text-white/70 px-3 py-1.5 rounded-full text-xs font-mono border border-white/10 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-electric-cyan rounded-full animate-pulse" />
                WebGL Canvas Active
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Feature 1: Timezone Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-40">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white uppercase tracking-wider sm:tracking-widest mb-4">
              <span className="text-electric-cyan">01.</span> Temporal Enforcement
            </h2>
            <p className="text-white/50 leading-relaxed mb-6">
              When operating across hemispheres, standard browser date logic fails instantly. We engineered a robust localization matrix that strictly binds the user's booking engine to the exact timezone of the business headquarters, entirely bypassing local system clock manipulation.
            </p>
          </motion.div>
          <CodeSnippet code={CODE_TIMEZONE} language="TypeScript" title="BookingWidget.tsx" />
        </div>

        {/* Feature 2: Secure Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-40">
          <div className="order-2 lg:order-1">
            <CodeSnippet code={CODE_FINANCE} language="TypeScript" title="booking.actions.ts" />
          </div>
          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white uppercase tracking-wider sm:tracking-widest mb-4">
              <span className="text-cyber-orange">02.</span> Financial Pipelines
            </h2>
            <p className="text-white/50 leading-relaxed mb-6">
              We seamlessly integrate PCI-compliant payment infrastructure deeply into the application flow. Utilizing custom Payment Intents alongside advanced webhook listeners, we map complex financial transactions securely into our PostgreSQL clusters without ever exposing secure tokens to the client state.
            </p>
          </motion.div>
        </div>

        {/* Feature 3: Automated Business Logic */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-40">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white uppercase tracking-wider sm:tracking-widest mb-4">
              <span className="text-[#df1b41]">03.</span> WebGL Geospatial Data
            </h2>
            <p className="text-white/50 leading-relaxed mb-6">
              We leverage Mapbox GL and hardware-accelerated mapping pipelines to render beautiful, ultra-responsive dark-mode geospatial coordinates, ensuring customers can flawlessly locate our localized headquarters globally.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="h-[400px] w-full rounded-2xl overflow-hidden border border-white/10 relative bg-[#111]"
          >
            <div className="absolute inset-0 pointer-events-none rounded-2xl z-10 shadow-[inset_0_0_120px_rgba(0,255,255,0.15)] ring-1 ring-inset ring-white/10" />
            {MAPBOX_TOKEN ? (
              <Map
                ref={mapRef}
                style={{ width: "100%", height: "100%" }}
                onZoom={(e) => setCurrentZoom(e.viewState.zoom)}
                minZoom={8}
                maxZoom={18}
                initialViewState={{
                  latitude: LATITUDE,
                  longitude: LONGITUDE,
                  zoom: 14,
                  pitch: 60,
                  bearing: -20,
                }}
                mapStyle="mapbox://styles/mapbox/dark-v11"
                mapboxAccessToken={MAPBOX_TOKEN}
                interactive={true}
                scrollZoom={false}
                dragPan={true}
                cooperativeGestures={true}
              >
                <NavigationControl position="bottom-right" showCompass={false} />

                <Marker longitude={LONGITUDE} latitude={LATITUDE} anchor="bottom">
                  <div className="relative flex flex-col items-center justify-center group cursor-crosshair">

                    {/* The Coordinates overlay */}
                    <div
                      className={`absolute bottom-full mb-2 flex flex-col items-center transition-all duration-700 ease-out ${currentZoom >= 14.5 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
                        }`}
                    >
                      <div className="bg-[#050505]/95 border border-electric-cyan/40 backdrop-blur-xl px-3 py-1.5 rounded flex items-center gap-2 shadow-[0_0_20px_rgba(0,255,255,0.3)] mb-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-electric-cyan animate-pulse" />
                        <span className="font-mono text-electric-cyan text-[11px] font-bold tracking-widest whitespace-nowrap">
                          TARGET: {LATITUDE.toFixed(4)}°, {LONGITUDE.toFixed(4)}°
                        </span>
                      </div>
                      <div className="w-[1px] h-4 bg-electric-cyan/60 absolute bottom-0 translate-y-full" />
                    </div>

                    <div className="relative flex items-center justify-center">
                      <div className="absolute w-12 h-12 bg-electric-cyan rounded-full animate-ping opacity-30" />
                      <div className="relative w-4 h-4 bg-electric-cyan rounded-full border-2 border-black shadow-[0_0_15px_rgba(0,255,255,0.8)]" />
                    </div>
                  </div>
                </Marker>
              </Map>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/50 font-mono text-sm">
                Loading Cinematic Map...
              </div>
            )}
            <div className="absolute top-4 right-4 pointer-events-none z-10">
              <span className="bg-[#050505]/80 backdrop-blur-md text-white/70 px-3 py-1.5 rounded-full text-xs font-mono border border-white/10">Mapbox GL</span>
            </div>
          </motion.div>
        </div>

        {/* Feature 4: Automated Business Logic */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-40">
          <div className="order-2 lg:order-1">
            <CodeSnippet code={CODE_REFUNDS} language="TypeScript" title="admin.actions.ts" />
          </div>
          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white uppercase tracking-wider sm:tracking-widest mb-4">
              <span className="text-[#25D366]">04.</span> Zero-Touch Operations
            </h2>
            <p className="text-white/50 leading-relaxed mb-6">
              Software should eliminate operational overhead, not create it. We developed a strict server-side engine that calculates exact chronological deltas to enforce business policies (like the 48-hour cancellation rule) entirely automatically. If the math aligns, Stripe issues the refund. If not, it blocks it. No human intervention required.
            </p>
          </motion.div>
        </div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center py-24 border-t border-white/10"
        >
          <h3 className="text-2xl font-heading font-bold text-white uppercase tracking-widest mb-6">
            Ready to experience the platform?
          </h3>
          <a href="https://auto-bath-detailing-melbourne.vercel.app" target="_blank" className="inline-block bg-white text-[#050505] px-10 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-electric-cyan hover:shadow-[0_0_40px_rgba(0,194,212,0.5)] transition-all">
            Visit Auto-Bath
          </a>
        </motion.div>

      </div>
    </main>
  );
}
