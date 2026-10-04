import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export default function TermsOfService() {
  return (
    <main className="bg-[#050505] min-h-screen overflow-x-hidden pt-32">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-20 relative z-10">
        <div className="mb-12">
          <Link href="/" className="text-electric-cyan text-sm font-mono tracking-widest hover:text-white transition-colors uppercase flex items-center gap-2 mb-8">
            &larr; Back to Facility
          </Link>
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-white uppercase tracking-tighter mb-4">
            Terms of <span className="text-cyber-orange">Service</span>
          </h1>
          <p className="text-white/50 font-mono text-sm">Last Updated: October 2026</p>
        </div>

        <div className="prose prose-invert prose-p:text-white/70 prose-headings:text-white prose-a:text-electric-cyan max-w-none font-sans">
          <h3>1. Acceptance of Terms</h3>
          <p>
            By booking an appointment or utilizing the services provided by Auto-Bath Detailing, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our services.
          </p>

          <h3>2. Appointment & Cancellation Policy</h3>
          <p>
            We operate strictly by appointment to ensure our master detailers have dedicated time for your vehicle. We require a minimum of 48 hours' notice for any cancellations or rescheduling. Failure to provide adequate notice may result in the forfeiture of your booking deposit.
          </p>

          <h3>3. Vehicle Condition & Valuables</h3>
          <p>
            Prior to handing over your vehicle, please remove all personal belongings, valuables, and child seats. Auto-Bath Detailing is not responsible for lost or damaged personal items left inside the vehicle. Heavily soiled vehicles (biohazards, extreme mud, pet hair) may be subject to additional surcharges, which will be communicated prior to commencing work.
          </p>

          <h3>4. Pre-Existing Damage</h3>
          <p>
            Our team conducts a thorough pre-inspection of every vehicle upon arrival. Pre-existing damage (scratches, dents, flaking clear coat, interior tears) will be documented. Auto-Bath Detailing cannot be held liable for the exacerbation of pre-existing flaws during our rigorous cleaning and correction processes.
          </p>

          <h3>5. Payment Terms</h3>
          <p>
            Payment is due in full upon completion of the services, prior to the release of the vehicle. We accept all major credit cards. Booking deposits are non-refundable but may be credited toward future services at management's discretion.
          </p>

          <h3>6. Governing Law</h3>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of Victoria, Australia, and you irrevocably submit to the exclusive jurisdiction of the courts in that State.
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
