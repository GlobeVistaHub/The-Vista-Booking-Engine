'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getPropertyById } from '@/data/api';
import { Property } from '@/types';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import { Shimmer } from '@/components/ui/Shimmer';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, ArrowLeft, ShieldCheck, MapPin, Star } from 'lucide-react';
import Link from 'next/link';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get('id');
  const [property, setProperty] = useState<Property | null>(null);
  const [loadingProperty, setLoadingProperty] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (propertyId) {
      setLoadingProperty(true);
      getPropertyById(Number(propertyId))
        .then(data => {
          if (data) {
            setProperty(data);
          } else {
            setError('Villa not found in our collection.');
          }
          setLoadingProperty(false);
        })
        .catch(err => {
          console.error('Fetch error:', err);
          setError('Failed to load your villa details.');
          setLoadingProperty(false);
        });
    } else {
      setError('No villa selected for booking.');
      setLoadingProperty(false);
    }
  }, [propertyId]);

  if (loadingProperty) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="h-10 w-48 bg-white/5 rounded-full animate-pulse" />
              <div className="h-64 w-full bg-white/5 rounded-3xl animate-pulse" />
            </div>
            <div className="space-y-8">
              <div className="h-[600px] w-full bg-white/5 rounded-3xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-8 bg-white/5 p-12 rounded-[40px] border border-white/10 backdrop-blur-xl"
        >
          <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
            <Home className="w-10 h-10 text-red-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white tracking-tight">Oops!</h1>
            <p className="text-white/60 text-lg">{error || 'Something went wrong.'}</p>
          </div>
          <Link href="/search" className="inline-flex items-center justify-center w-full px-8 py-4 bg-white text-black font-semibold rounded-2xl hover:bg-white/90 transition-all duration-300">
            Return to Search
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0A0B] pt-32 pb-20 px-4 Selection:bg-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="mb-12 flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-3 text-white/50 hover:text-white transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-medium">Go Back</span>
          </button>
          
          <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span className="text-emerald-500 font-medium text-sm">Secure Checkout</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Side: Property Overview */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8 lg:sticky lg:top-32"
          >
            <div className="relative aspect-[16/10] rounded-[40px] overflow-hidden group">
              <img 
                src={property.images[0]} 
                alt={property.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-white font-medium">4.9 • Superhost Choice</span>
                </div>
                <h1 className="text-4xl font-bold text-white tracking-tight mb-2">{property.title}</h1>
                <div className="flex items-center gap-2 text-white/70">
                  <MapPin className="w-4 h-4" />
                  <span>{property.location}</span>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 space-y-6">
              <h3 className="text-xl font-semibold text-white">Booking Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-white/60">
                  <span>Price per night</span>
                  <span className="text-white font-medium">${property.price}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Elite Service Fee</span>
                  <span className="text-white font-medium">$0</span>
                </div>
                <div className="h-px bg-white/10" />
                <div className="flex justify-between items-end">
                  <span className="text-white/60">Instant Confirmation</span>
                  <span className="text-2xl font-bold text-white tracking-tight">Available</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Checkout Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white rounded-[40px] p-8 lg:p-12 shadow-2xl shadow-white/5">
              <h2 className="text-3xl font-bold text-black tracking-tight mb-8">Personal Details</h2>
              <CheckoutForm property={property} />
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0B] pt-32 px-4"><div className="animate-pulse h-10 w-48 bg-white/5 rounded-full" /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
