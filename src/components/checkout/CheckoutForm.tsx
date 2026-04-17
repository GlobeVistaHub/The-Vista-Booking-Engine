"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, ShieldCheck, Mail, User, Phone, ArrowRight, Loader2 } from "lucide-react";
import { Property } from "@/data/properties";

interface CheckoutFormProps {
  property: Property;
  guest?: {
    name?: string;
    email?: string;
  };
}

export default function CheckoutForm({ property, guest }: CheckoutFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: guest?.name || "",
    email: guest?.email || "",
    phone: "",
  });

  const handlePay = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill in all guest details.");
      return;
    }

    setLoading(true);
    console.log("[TITANIUM CHECKOUT] Initiating payment for:", property.id);

    try {
      const response = await fetch("/api/payments/paymob/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: String(property.id),
          guestName: formData.name,
          guestEmail: formData.email,
          amountUSD: property.price, // Assuming property.price is in USD
          exchangeRate: 50.0, // Fixed or dynamic rate
          checkIn: new Date().toISOString().split('T')[0], // Placeholder context
          checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          adults: 2,
          children: 0
        }),
      });

      const data = await response.json();

      if (data.paymentToken) {
        console.log("[TITANIUM CHECKOUT] Handshake Successful. Launching Iframe.");
        const iframeId = process.env.NEXT_PUBLIC_PAYMOB_IFRAME_ID;
        const checkoutUrl = `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${data.paymentToken}`;
        window.location.href = checkoutUrl;
      } else {
        throw new Error(data.error || "Failed to get payment token");
      }
    } catch (error) {
      console.error("[TITANIUM CHECKOUT] Failed:", error);
      alert("Payment initiation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* LEFT: GUEST INFO FORM */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-surface p-8 rounded-3xl border border-navy/5 shadow-xl"
      >
        <h2 className="text-2xl font-bold text-navy mb-6 flex items-center gap-3">
          <User className="text-primary w-6 h-6" />
          Guest Details
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                placeholder="John Doe"
                className="w-full bg-white border border-navy/10 rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 transition-all text-navy outline-none"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="email"
                placeholder="john@example.com"
                className="w-full bg-white border border-navy/10 rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 transition-all text-navy outline-none"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="tel"
                placeholder="+20 1XX XXX XXXX"
                className="w-full bg-white border border-navy/10 rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 transition-all text-navy outline-none"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-navy/5">
          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <CreditCard className="w-6 h-6" />
                Proceed to Secure Payment
                <ArrowRight className="w-5 h-5 ml-auto" />
              </>
            )}
          </button>
          
          <div className="flex items-center justify-center gap-2 mt-4 text-muted text-sm">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            Payments secured by Paymob
          </div>
        </div>
      </motion.div>

      {/* RIGHT: PROPERTY SUMMARY */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div className="bg-navy p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] opacity-60 mb-1">Reservation Summary</h3>
            <h2 className="text-2xl font-bold mb-6">{property.title}</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm opacity-80">
                <span>Nightly Rate</span>
                <span>${property.price}</span>
              </div>
              <div className="flex justify-between text-sm opacity-80">
                <span>Cleaning & Service</span>
                <span>$0</span>
              </div>
              <div className="w-full h-px bg-white/10 my-4" />
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total Amount</span>
                <span className="text-primary-light">USD {property.price}</span>
              </div>
              <div className="text-[10px] text-white/40 uppercase tracking-widest text-right">
                Approx. EGP {property.price * 50}
              </div>
            </div>
          </div>
          
          {/* DECORATIVE ELEMENT */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full -mr-16 -mt-16" />
        </div>

        <div className="bg-white p-6 rounded-2xl border border-navy/5 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-navy text-sm">Instant Confirmation</h4>
            <p className="text-xs text-muted">Your calendar is locked immediately after payment.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
