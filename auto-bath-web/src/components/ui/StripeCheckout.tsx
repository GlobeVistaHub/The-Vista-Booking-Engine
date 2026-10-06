"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Lock } from "lucide-react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm({ amount }: { amount: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsProcessing(true);
    setError(null);

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || "An error occurred");
      setIsProcessing(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/booking/success`,
      },
    });

    if (error) {
      setError(error.type === "card_error" || error.type === "validation_error" 
        ? error.message || "Payment failed" 
        : "An unexpected error occurred.");
    }
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full mt-4">
      <PaymentElement options={{ 
        layout: "tabs",
      }} />
      
      {error && (
        <div className="text-[#df1b41] text-sm font-mono mt-2 bg-[#df1b41]/10 border border-[#df1b41]/20 p-3 rounded-lg">
          {error}
        </div>
      )}
      
      <button 
        disabled={isProcessing || !stripe || !elements}
        className="w-full mt-6 bg-electric-cyan text-vantablack hover:bg-white shadow-[0_0_30px_rgba(0,194,212,0.4)] disabled:bg-white/10 disabled:text-white/30 disabled:shadow-none disabled:cursor-not-allowed font-bold uppercase tracking-widest text-sm py-4 rounded-full flex items-center justify-center gap-2 transition-all"
      >
        {isProcessing ? "Processing..." : `Pay $${amount}`}
        <Lock size={16} />
      </button>
    </form>
  );
}

export default function StripeCheckout({ clientSecret, amount, serviceName }: { clientSecret: string, amount: number, serviceName: string }) {
  if (!clientSecret) return null;
  return (
    <Elements stripe={stripePromise} options={{ 
      clientSecret, 
      appearance: { 
        theme: 'night',
        variables: {
          colorPrimary: '#00C2D4',
          colorBackground: '#111111',
          colorText: '#ffffff',
          colorDanger: '#df1b41',
          fontFamily: 'monospace',
          spacingUnit: '4px',
          borderRadius: '12px',
          colorBorder: 'rgba(255, 255, 255, 0.1)',
        },
        rules: {
          '.Input': {
            backgroundColor: '#050505',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '12px 16px',
          },
          '.Input:focus': {
            borderColor: '#00C2D4',
            boxShadow: 'none',
          },
          '.Label': {
            color: 'rgba(255, 255, 255, 0.5)',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }
        }
      } 
    }}>
      <CheckoutForm amount={amount} />
    </Elements>
  );
}
