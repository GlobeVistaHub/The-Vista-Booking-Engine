import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export default function PrivacyPolicy() {
  return (
    <main className="bg-[#050505] min-h-screen overflow-x-hidden pt-32">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-20 relative z-10">
        <div className="mb-12">
          <Link href="/" className="text-electric-cyan text-sm font-mono tracking-widest hover:text-white transition-colors uppercase flex items-center gap-2 mb-8">
            &larr; Back to Facility
          </Link>
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-white uppercase tracking-tighter mb-4">
            Privacy <span className="text-cyber-orange">Policy</span>
          </h1>
          <p className="text-white/50 font-mono text-sm">Last Updated: October 2026</p>
        </div>

        <div className="prose prose-invert prose-p:text-white/70 prose-headings:text-white prose-a:text-electric-cyan max-w-none font-sans">
          <h3>1. Introduction</h3>
          <p>
            Auto-Bath Detailing ("we," "our," or "us") is committed to protecting the privacy and security of our exclusive clientele. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our facility, use our website, or engage our services.
          </p>

          <h3>2. Information We Collect</h3>
          <p>
            To provide you with concourse-level service, we may collect:
          </p>
          <ul>
            <li><strong>Personal Identification Information:</strong> Name, email address, phone number, and physical address.</li>
            <li><strong>Vehicle Information:</strong> Make, model, year, registration plates, and condition reports.</li>
            <li><strong>Payment Information:</strong> Credit card details and billing addresses (processed securely via Stripe).</li>
          </ul>

          <h3>3. How We Use Your Information</h3>
          <p>
            Your information is strictly utilized to facilitate your bookings, manage our CRM system, process secure payments, and communicate critical updates regarding your vehicle's status while in our care. We do not sell, rent, or lease our client lists to third parties under any circumstances.
          </p>

          <h3>4. Cookies and Tracking Technologies</h3>
          <p>
            Our digital platform utilizes cookies and similar tracking technologies to enhance user experience, analyze site traffic, and optimize our booking flows. You have the right to accept or decline cookies through your browser settings, though declining may limit certain functionalities of our booking portal.
          </p>

          <h3>5. Security of Your Information</h3>
          <p>
            We implement enterprise-grade administrative, technical, and physical security measures to protect your personal data. Our facility is monitored 24/7, and our digital infrastructure is encrypted and managed by elite security protocols.
          </p>

          <h3>6. Contact Us</h3>
          <p>
            For any inquiries regarding this Privacy Policy, please contact our management team at: <strong>booking@autobath.com.au</strong> or <strong>+61 400 764 508</strong>.
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
