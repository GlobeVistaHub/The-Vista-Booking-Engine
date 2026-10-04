"use client";

import { useState, useEffect } from "react";
import { X, Check, Calendar, Clock, Car, User, ChevronRight, ChevronLeft, CreditCard, Lock } from "lucide-react";
import { useBooking } from "@/context/BookingContext";

// Actual Data from PricingGrid
const PACKAGES = [
  { id: "wash", name: "Premium Hand Wash", price: 80, time: "1.5 Hours", type: "standard" },
  { id: "interior", name: "Interior Detailing", price: 150, time: "2.5 Hours", type: "standard" },
  { id: "paint", name: "Paint Correction", price: 400, time: "1 Day", type: "standard" },
  { id: "ceramic", name: "Ceramic Coating", price: 1200, time: "2 Days", type: "premium" },
];

export default function BookingWidget() {
  const { isBookingOpen, closeBooking, selectedPackage, setSelectedPackage } = useBooking();
  const [step, setStep] = useState(1);
  
  // Step 2: Date & Time State
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Generate Calendar Days
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };
  const calendarDays = getDaysInMonth(currentMonth);

  const AVAILABLE_TIMES = [
    "09:00 AM", "09:30 AM", "10:30 AM", "11:30 AM", "01:00 PM", "02:30 PM", "04:00 PM"
  ];

  // Step 3: User Details State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    vehicle: ""
  });
  
  const isFormValid = formData.name.trim() !== "" && formData.email.trim() !== "" && formData.phone.trim() !== "" && formData.vehicle.trim() !== "";

  const handleInteraction = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>, pkgId: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  if (!isBookingOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Dynamic Backdrop Blur */}
      <div 
        className="absolute inset-0 bg-[#050505]/80 backdrop-blur-xl transition-opacity duration-500"
        onClick={closeBooking}
      />

      {/* Custom Keyframes for Hover Effects */}
      <style>{`
      `}</style>

      {/* SVG Filter for Premium Hydrophobic Ripple Effect */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <filter id="hydro-ripple" x="-20%" y="-20%" width="140%" height="140%">
          {/* Lower frequency = larger, smoother water waves. Longer duration = elegant luxury movement */}
          <feTurbulence type="fractalNoise" baseFrequency="0.004" numOctaves="3" result="noise">
            <animate attributeName="baseFrequency" values="0.004;0.008;0.004" dur="15s" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="40" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {/* Booking Modal Container */}
      <div className="relative w-full max-w-4xl h-[80vh] sm:h-[700px] bg-[#111]/90 border border-white/10 rounded-3xl shadow-[0_0_100px_rgba(0,194,212,0.1)] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
          <h2 className="font-heading text-2xl text-white uppercase tracking-widest">
            Secure <span className="text-cyber-orange">Booking</span>
          </h2>
          <button 
            onClick={closeBooking}
            className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Step Indicator (4 Segments) */}
        <div className="flex w-full h-1.5 bg-[#050505] gap-1 px-0.5">
          {[1, 2, 3, 4].map((s) => (
            <div 
              key={s} 
              className={`h-full flex-1 transition-all duration-500 ${
                step >= s ? "bg-cyber-orange shadow-[0_0_10px_rgba(255,102,0,0.5)]" : "bg-white/10"
              }`} 
            />
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 hide-scrollbar">
          
          {/* STEP 1: Service Selection */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="mb-8">
                <h3 className="text-white text-3xl font-heading uppercase mb-2">Select Package</h3>
                <p className="text-white/50 font-sans">Choose your desired level of rejuvenation.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PACKAGES.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg.id)}
                    onMouseMove={(e) => handleInteraction(e, pkg.id)}
                    onTouchMove={(e) => handleInteraction(e, pkg.id)}
                    className={`relative group text-left p-6 rounded-2xl border transition-all duration-300 overflow-hidden ${
                      selectedPackage === pkg.id 
                        ? "border-electric-cyan bg-electric-cyan/10" 
                        : "border-white/10 bg-white/5 hover:border-white/30"
                    }`}
                  >
                    {/* 1. Premium Hand Wash: Squeegee Glass Water Sheen (Tracks Cursor X) */}
                    {pkg.id === "wash" && (
                      <div className={`absolute inset-0 transition-opacity duration-500 pointer-events-none overflow-hidden rounded-2xl ${selectedPackage === pkg.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        {/* A sharp glass reflection that is physically dragged by the cursor's X position, acting like a squeegee */}
                        <div 
                          className="absolute top-0 w-[30%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[45deg]"
                          style={{
                            left: 'calc(var(--mouse-x, 50%) - 15%)',
                            transition: 'left 0.1s ease-out'
                          }}
                        />
                      </div>
                    )}

                    {/* 2. Interior Detailing: Ambient Footwell Lighting (Tracks Cursor/Finger) */}
                    {pkg.id === "interior" && (
                      <div className={`absolute inset-0 transition-opacity duration-700 pointer-events-none overflow-hidden rounded-2xl mix-blend-screen ${selectedPackage === pkg.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        {/* Soft, warm glow that follows the cursor or finger */}
                        <div 
                          className="absolute inset-0 transition-opacity duration-300"
                          style={{
                            background: `radial-gradient(250px circle at var(--mouse-x, 50%) var(--mouse-y, 100%), rgba(255,102,0,0.25), transparent 60%)`
                          }}
                        />
                        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-cyber-orange shadow-[0_0_15px_rgba(255,102,0,0.5)]" />
                      </div>
                    )}

                    {/* 3. Paint Correction: Flawless Gloss Reflection */}
                    {pkg.id === "paint" && (
                      <div className={`absolute inset-0 transition-opacity duration-700 pointer-events-none overflow-hidden rounded-2xl mix-blend-screen ${selectedPackage === pkg.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        {/* A spinning conic gradient that simulates a swirl-finder light reflecting off a flawless clear coat */}
                        <div className="w-[300%] h-[300%] absolute -top-full -left-full bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,rgba(0,194,212,0.1)_25%,rgba(255,255,255,0.3)_50%,rgba(0,194,212,0.1)_75%,transparent_100%)] animate-[spin_5s_linear_infinite]" />
                      </div>
                    )}

                    {/* 4. Ceramic Coating: Slow, Premium Hydrophobic Ripple */}
                    {pkg.type === "premium" && (
                      <div className={`absolute inset-0 transition-opacity duration-700 pointer-events-none overflow-hidden rounded-2xl ${selectedPackage === pkg.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        {/* Scaled up (-inset-4 scale-110) to prevent the SVG displacement map from clipping the edges! */}
                        <div 
                          className="absolute -inset-4 scale-110 [filter:url(#hydro-ripple)] mix-blend-screen transition-opacity duration-300"
                          style={{
                            background: `radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0,194,212,0.8) 0%, rgba(0,50,255,0.2) 60%, transparent 100%)`
                          }}
                        />
                      </div>
                    )}

                    <div className="relative z-10">
                      {pkg.type === "premium" && (
                        <span className="inline-block px-3 py-1 mb-4 text-[10px] font-bold uppercase tracking-widest text-[#050505] bg-luxury-gold rounded-full">
                          Master Craft
                        </span>
                      )}
                      <h4 className="text-xl text-white font-bold mb-2">{pkg.name}</h4>
                      <p className="text-3xl text-electric-cyan font-heading mb-4">${pkg.price}</p>
                      
                      <div className="flex items-center gap-2 text-sm text-white/50 font-mono">
                        <Clock size={14} />
                        <span>{pkg.time}</span>
                      </div>
                    </div>

                    {/* Selection Ring */}
                    <div className={`absolute top-6 right-6 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selectedPackage === pkg.id ? "border-electric-cyan bg-electric-cyan" : "border-white/20"
                    }`}>
                      {selectedPackage === pkg.id && <Check size={14} className="text-[#050505]" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: CALENDAR & TIME SELECTION */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="mb-8">
                <h3 className="text-white text-3xl font-heading uppercase mb-2">Select Date & Time</h3>
                <p className="text-white/50 font-sans">Choose your preferred drop-off slot.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Calendar */}
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
                    {/* Calendar Header */}
                    <div className="flex justify-between items-center mb-6">
                      <button 
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                        className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <div className="font-sans font-bold text-lg text-white">
                        {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                      </div>
                      <button 
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                        className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {/* Days of Week */}
                    <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-mono text-white/50">
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d}>{d}</div>)}
                    </div>
                    
                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2">
                      {calendarDays.map((date, i) => {
                        if (!date) return <div key={i} className="aspect-square" />;
                        
                        const isPast = date < new Date(new Date().setHours(0,0,0,0));
                        const isSelected = selectedDate?.toDateString() === date.toDateString();
                        
                        return (
                          <button
                            key={i}
                            disabled={isPast}
                            onClick={() => { setSelectedDate(date); setSelectedTime(null); }}
                            className={`aspect-square flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300 ${
                              isPast ? "text-white/20 cursor-not-allowed" : 
                              isSelected ? "bg-electric-cyan text-vantablack shadow-[0_0_15px_rgba(0,194,212,0.5)] scale-110 font-bold" : 
                              "text-white/70 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            {date.getDate()}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Column: Time Slots */}
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl border border-white/10 bg-white/5 h-full">
                    {!selectedDate ? (
                      <div className="h-full flex flex-col items-center justify-center text-white/40 font-mono text-sm py-12">
                        <Calendar className="w-10 h-10 mb-4 opacity-50" />
                        Please select a date first
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 animate-in fade-in duration-300">
                        {AVAILABLE_TIMES.map((time, i) => {
                          const isSelected = selectedTime === time;
                          // Fake some unavailable times randomly for realism based on the date
                          const isUnavailable = (selectedDate.getDate() + i) % 5 === 0;
                          
                          return (
                            <button
                              key={time}
                              disabled={isUnavailable}
                              onClick={() => setSelectedTime(time)}
                              className={`py-3 px-4 rounded-xl font-mono text-sm transition-all duration-300 border ${
                                isUnavailable ? "border-white/5 bg-white/5 text-white/20 cursor-not-allowed line-through" :
                                isSelected ? "border-electric-cyan bg-electric-cyan/20 text-electric-cyan shadow-[0_0_15px_rgba(0,194,212,0.2)]" :
                                "border-white/10 bg-transparent text-white/70 hover:border-white/30 hover:bg-white/5 hover:text-white"
                              }`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW & DETAILS */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="mb-8">
                <h3 className="text-white text-3xl font-heading uppercase mb-2">Final Details</h3>
                <p className="text-white/50 font-sans">Review your booking and enter your information.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Order Summary */}
                <div className="space-y-6">
                  <div className="p-8 rounded-2xl border border-electric-cyan bg-electric-cyan/5 shadow-[0_0_30px_rgba(0,194,212,0.1)]">
                    <h4 className="text-electric-cyan font-mono text-sm tracking-widest uppercase mb-6 flex items-center gap-2">
                      <Check size={16} /> Order Summary
                    </h4>
                    
                    {(() => {
                      const pkg = PACKAGES.find(p => p.id === selectedPackage);
                      if (!pkg) return null;
                      return (
                        <div className="space-y-6">
                          <div>
                            <p className="text-white/50 text-xs font-mono uppercase mb-1">Service</p>
                            <p className="text-xl text-white font-bold">{pkg.name}</p>
                            <p className="text-cyber-orange font-heading text-2xl mt-1">${pkg.price}</p>
                          </div>
                          
                          <div className="h-[1px] w-full bg-white/10" />
                          
                          <div>
                            <p className="text-white/50 text-xs font-mono uppercase mb-1">Date & Time</p>
                            <p className="text-lg text-white font-medium flex items-center gap-2">
                              <Calendar size={16} className="text-electric-cyan" />
                              {selectedDate?.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}
                            </p>
                            <p className="text-lg text-white font-medium flex items-center gap-2 mt-2">
                              <Clock size={16} className="text-electric-cyan" />
                              {selectedTime}
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Right Column: User Form */}
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-4">
                    <div>
                      <label className="block text-xs font-mono text-white/50 uppercase mb-2">Full Name</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-cyan transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-white/50 uppercase mb-2">Email Address</label>
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-cyan transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-white/50 uppercase mb-2">Phone Number</label>
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-cyan transition-colors"
                        placeholder="(555) 000-0000"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-white/50 uppercase mb-2">Vehicle Make & Model</label>
                      <input 
                        type="text" 
                        value={formData.vehicle}
                        onChange={(e) => setFormData({...formData, vehicle: e.target.value})}
                        className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-cyan transition-colors"
                        placeholder="e.g. 2024 Porsche 911 GT3"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: CHECKOUT (STRIPE MOCK) */}
          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 h-full flex flex-col justify-center max-w-xl mx-auto">
              <div className="mb-8 text-center">
                <h3 className="text-white text-3xl font-heading uppercase mb-2">Secure Checkout</h3>
                <p className="text-white/50 font-sans flex items-center justify-center gap-2">
                  <Lock size={14} /> Payments are processed securely via Stripe.
                </p>
              </div>

              <div className="p-8 rounded-2xl border border-white/10 bg-[#050505] shadow-2xl relative overflow-hidden">
                {/* Subtle gradient glow inside the card */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-cyber-orange/5 blur-3xl pointer-events-none" />
                
                <div className="relative z-10 space-y-6">
                  {/* Total Amount */}
                  <div className="flex justify-between items-end border-b border-white/10 pb-6">
                    <div>
                      <p className="text-white/50 text-xs font-mono uppercase mb-1">Total Due Today</p>
                      <p className="text-xl text-white font-bold">{PACKAGES.find(p => p.id === selectedPackage)?.name}</p>
                    </div>
                    <p className="text-4xl text-cyber-orange font-heading">${PACKAGES.find(p => p.id === selectedPackage)?.price}</p>
                  </div>

                  {/* Mocked Credit Card Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono text-white/50 uppercase mb-2">Card Number</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-electric-cyan transition-colors font-mono tracking-widest placeholder:text-white/20"
                          placeholder="0000 0000 0000 0000"
                        />
                        <CreditCard size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-white/50 uppercase mb-2">Expiry Date</label>
                        <input 
                          type="text" 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-cyan transition-colors font-mono tracking-widest placeholder:text-white/20"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-white/50 uppercase mb-2">CVC</label>
                        <input 
                          type="text" 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-cyan transition-colors font-mono tracking-widest placeholder:text-white/20"
                          placeholder="123"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-mono text-white/50 uppercase mb-2">Name on Card</label>
                      <input 
                        type="text" 
                        defaultValue={formData.name}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-cyan transition-colors placeholder:text-white/20"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/10 bg-[#050505] flex justify-between items-center">
          <button 
            onClick={() => setStep(Math.max(1, step - 1))}
            className={`px-6 py-3 text-white/50 font-bold uppercase tracking-widest text-sm hover:text-white transition-colors ${step === 1 ? 'invisible' : ''}`}
          >
            Back
          </button>
          
          <button 
            onClick={() => {
              if (step === 1 && !selectedPackage) return;
              if (step === 2 && (!selectedDate || !selectedTime)) return;
              if (step === 3 && !isFormValid) return;
              if (step === 4) {
                // Mock Payment Submission
                alert("Payment successful! Redirecting to confirmation page...");
                closeBooking();
                return;
              }
              setStep(Math.min(4, step + 1));
            }}
            disabled={(step === 1 && !selectedPackage) || (step === 2 && (!selectedDate || !selectedTime)) || (step === 3 && !isFormValid)}
            className={`px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm flex items-center gap-2 transition-all ${
              (step === 1 && !selectedPackage) || (step === 2 && (!selectedDate || !selectedTime)) || (step === 3 && !isFormValid)
                ? "bg-white/5 text-white/30 cursor-not-allowed" 
                : step === 4
                  ? "bg-electric-cyan text-vantablack hover:bg-white shadow-[0_0_30px_rgba(0,194,212,0.4)]"
                  : "bg-cyber-orange text-[#050505] hover:bg-white shadow-[0_0_30px_rgba(255,102,0,0.4)]"
            }`}
          >
            {step === 4 ? `Pay $${PACKAGES.find(p => p.id === selectedPackage)?.price}` : step === 3 ? "Proceed to Payment" : step === 2 ? "Review Details" : "Continue"}
            {step === 4 ? <Lock size={16} /> : <ChevronRight size={18} />}
          </button>
        </div>

      </div>
    </div>
  );
}
