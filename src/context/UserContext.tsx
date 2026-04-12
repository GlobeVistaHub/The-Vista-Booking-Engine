"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface UserContextType {
  wishlist: number[];
  toggleWishlist: (id: number) => void;
  isInWishlist: (id: number) => boolean;
  
  preferences: string[];
  togglePreference: (pref: string) => void;
  
  guestName: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [preferences, setPreferences] = useState<string[]>(["Ocean Views", "High Security"]);
  const [guestName] = useState("Sarah Al-Fayed"); // Default demo name

  // Persist to localStorage for demo reliability
  useEffect(() => {
    const savedWishlist = localStorage.getItem("vista_wishlist");
    const savedPrefs = localStorage.getItem("vista_prefs");
    
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    if (savedPrefs) setPreferences(JSON.parse(savedPrefs));
  }, []);

  useEffect(() => {
    localStorage.setItem("vista_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("vista_prefs", JSON.stringify(preferences));
  }, [preferences]);

  const toggleWishlist = (id: number) => {
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const isInWishlist = (id: number) => wishlist.includes(id);

  const togglePreference = (pref: string) => {
    setPreferences(prev => 
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

  return (
    <UserContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, preferences, togglePreference, guestName }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
