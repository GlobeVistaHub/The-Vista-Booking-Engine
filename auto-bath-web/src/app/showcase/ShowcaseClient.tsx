"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { CodeSnippet } from "@/components/ui/CodeSnippet";

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

export function ShowcaseClient() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <main className="min-h-screen bg-[#050505] selection:bg-electric-cyan/30 selection:text-white relative overflow-hidden font-sans">
      
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block py-1 px-3 rounded-full border border-white/10 bg-white/5 text-white/50 text-xs font-mono uppercase tracking-widest mb-6">
              Goodbrains Studio // Case Study
            </span>
            <h1 className="text-5xl md:text-7xl font-heading font-bold text-white uppercase tracking-tighter leading-tight mb-8">
              Engineering <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-cyan to-cyber-orange">
                Digital Machines.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/50 max-w-2xl font-light leading-relaxed">
              We don't just build websites. We architect high-performance SaaS infrastructure, automate complex financial pipelines, and enforce zero-latency global state management.
            </p>
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
            <h2 className="text-3xl font-heading font-bold text-white uppercase tracking-widest mb-4">
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
            <h2 className="text-3xl font-heading font-bold text-white uppercase tracking-widest mb-4">
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
            <h2 className="text-3xl font-heading font-bold text-white uppercase tracking-widest mb-4">
              <span className="text-[#df1b41]">03.</span> Zero-Touch Operations
            </h2>
            <p className="text-white/50 leading-relaxed mb-6">
              Software should eliminate operational overhead, not create it. We developed a strict server-side engine that calculates exact chronological deltas to enforce business policies (like the 48-hour cancellation rule) entirely automatically. If the math aligns, Stripe issues the refund. If not, it blocks it. No human intervention required.
            </p>
          </motion.div>
          <CodeSnippet code={CODE_REFUNDS} language="TypeScript" title="admin.actions.ts" />
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
            Ready to scale your infrastructure?
          </h3>
          <a href="https://www.goodbrains.pro" target="_blank" className="inline-block bg-white text-[#050505] px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-electric-cyan hover:shadow-[0_0_40px_rgba(0,194,212,0.5)] transition-all">
            Visit Goodbrains Studio
          </a>
        </motion.div>

      </div>
    </main>
  );
}
