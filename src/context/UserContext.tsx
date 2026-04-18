"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface UserContextType {
  wishlist: (string | number)[];
  toggleWishlist: (id: string | number) => void;
  isInWishlist: (id: string | number) => boolean;
  
  preferences: string[];
  togglePreference: (pref: string) => void;
  
  guestName: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<(string | number)[]>([]);
  const [preferences, setPreferences] = useState<string[]>(["Ocean Views", "High Security"]);
  const [guestName] = useState("Vista Guest");
  // Guard: only save AFTER we've loaded from localStorage (prevents overwriting on mount)
  const [hydrated, setHydrated] = useState(false);

  // LOAD from localStorage on mount
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem("vista_wishlist");
      const savedPrefs = localStorage.getItem("vista_prefs");
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      if (savedPrefs) setPreferences(JSON.parse(savedPrefs));
    } catch (e) {}
    setHydrated(true);
  }, []);

  // SAVE wishlist — only after hydration to prevent overwriting on first render
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("vista_wishlist", JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  // SAVE preferences — only after hydration
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("vista_prefs", JSON.stringify(preferences));
  }, [preferences, hydrated]);

  const toggleWishlist = (id: string | number) => {
    const stringId = String(id);
    setWishlist(prev =>
      prev.map(String).includes(stringId) 
        ? prev.filter(item => String(item) !== stringId) 
        : [...prev, id]
    );
  };

  const isInWishlist = (id: string | number) => wishlist.map(String).includes(String(id));

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
