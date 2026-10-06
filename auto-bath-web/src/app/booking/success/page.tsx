import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { verifyAndConfirmPayment } from "./actions";

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ payment_intent?: string; payment_intent_client_secret?: string; redirect_status?: string }>;
}) {
  const resolvedParams = await searchParams;
  
  // Instantly verify and confirm the booking in Supabase without waiting for Webhooks!
  if (resolvedParams.payment_intent && resolvedParams.redirect_status === "succeeded") {
    await verifyAndConfirmPayment(resolvedParams.payment_intent);
  }

  return (
    <div className="min-h-screen bg-vantablack flex flex-col items-center justify-center p-6 text-center">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-electric-cyan/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-electric-cyan/20 flex items-center justify-center mb-8 border border-electric-cyan/30 shadow-[0_0_50px_rgba(0,194,212,0.3)] animate-pulse">
          <CheckCircle className="w-12 h-12 text-electric-cyan" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4 tracking-wider uppercase">
          Booking Confirmed
        </h1>
        
        <p className="text-white/60 text-lg max-w-md mx-auto mb-12 font-sans">
          Your payment was successful and your vehicle is locked in. We have sent a confirmation receipt to your email.
        </p>
        
        <Link 
          href="/" 
          className="px-8 py-3 rounded-full bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-sm hover:bg-electric-cyan hover:text-vantablack hover:border-electric-cyan transition-all shadow-lg hover:shadow-[0_0_30px_rgba(0,194,212,0.4)]"
        >
          Return to Vault
        </Link>
      </div>
    </div>
  );
}
