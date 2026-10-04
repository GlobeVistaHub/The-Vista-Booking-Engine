"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface BookingContextType {
  isBookingOpen: boolean;
  selectedPackage: string | null;
  openBooking: (packageId?: string) => void;
  closeBooking: () => void;
  setSelectedPackage: (id: string) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const openBooking = (packageId?: string) => {
    if (packageId) setSelectedPackage(packageId);
    setIsBookingOpen(true);
  };

  const closeBooking = () => {
    setIsBookingOpen(false);
  };

  return (
    <BookingContext.Provider
      value={{
        isBookingOpen,
        selectedPackage,
        openBooking,
        closeBooking,
        setSelectedPackage,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
