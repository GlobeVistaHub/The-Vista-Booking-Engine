"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How long does a premium detail take?",
    answer: "A standard concourse-level detail typically requires 3 to 5 hours, depending on the current condition of the vehicle. Paint correction and ceramic coating packages will require the vehicle to stay in our climate-controlled facility for 2 to 3 days to ensure proper curing."
  },
  {
    question: "Do you offer mobile detailing services?",
    answer: "No. To maintain our uncompromising standards of perfection, all work must be performed in our dust-free, climate-controlled facility under specialized lighting. This ensures a flawless finish that cannot be achieved in a driveway or outdoor environment."
  },
  {
    question: "What is the difference between a wax and a ceramic coating?",
    answer: "Traditional carnauba wax provides a warm glow but only lasts 1 to 3 months and offers minimal protection. Our Gtechniq Ceramic Coatings chemically bond to your clear coat, providing years of extreme hydrophobicity, UV protection, and resistance to micro-scratching."
  },
  {
    question: "Do I need an appointment, or can I walk in?",
    answer: "Auto-Bath operates strictly by appointment only. This ensures our master detailers have the uninterrupted time required to dedicate to your specific vehicle without rushing."
  },
  {
    question: "How do you handle my data and do you use cookies?",
    answer: "We take client privacy extremely seriously. Our booking platform utilizes enterprise-grade encryption (Stripe) for all payments. We only collect essential information required to service your vehicle. Our site uses minimal, strictly necessary cookies to ensure the booking engine functions smoothly and securely. We never sell or share your data. For full details, please review our Privacy Policy at the bottom of the page."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="w-full py-8 md:py-32 bg-[#050505] relative border-t border-white/5">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-electric-cyan/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-white uppercase tracking-tighter mb-4">
            Client <span className="text-cyber-orange">Inquiries</span>
          </h2>
          <p className="font-sans text-white/50 text-lg">
            Answers to common questions regarding our processes and facility.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`border border-white/10 rounded-2xl bg-white/5 backdrop-blur-md overflow-hidden transition-all duration-300 ${openIndex === index ? 'shadow-[0_0_20px_rgba(0,194,212,0.15)] border-electric-cyan/30' : 'hover:border-white/20'}`}
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none group"
              >
                <span className={`font-sans font-bold text-sm tracking-wide transition-colors ${openIndex === index ? 'text-electric-cyan' : 'text-white group-hover:text-electric-cyan'}`}>
                  {faq.question}
                </span>
                <ChevronDown 
                  size={20} 
                  className={`text-white/50 transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-electric-cyan' : 'group-hover:text-white'}`} 
                />
              </button>
              
              <div 
                className={`grid transition-all duration-300 ease-in-out ${openIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden">
                  <div className="px-6 pb-6 pt-0 text-white/60 font-sans text-sm leading-relaxed border-t border-white/5 mt-2 pt-4">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
