"use client";

import { useEffect } from "react";
import { useAppModeStore } from "@/store/appModeStore";
import { useAppStore } from "@/hooks/useAppStore";

export default function BrandingEngine() {
  const brandColor = useAppStore(useAppModeStore, (s) => s.brandColor) as string;

  useEffect(() => {
    // 1. Convert Hex to RGB - Robust parsing for 7-char hex
    if (!brandColor || brandColor.length !== 7 || !brandColor.startsWith("#")) {
      // Fallback to Navy if color is malformed
      const fallbackRgb = "3, 20, 40";
      document.documentElement.style.setProperty("--primary", "#031428");
      document.documentElement.style.setProperty("--primary-rgb", fallbackRgb);
      return;
    }

    try {
      const r = parseInt(brandColor.slice(1, 3), 16);
      const g = parseInt(brandColor.slice(3, 5), 16);
      const b = parseInt(brandColor.slice(5, 7), 16);
      const rgb = `${r}, ${g}, ${b}`;

      // 2. Inject CSS Variables into :root
      const root = document.documentElement;
      root.style.setProperty("--primary", brandColor);
      root.style.setProperty("--primary-rgb", rgb);
      
      // 3. Update active shadows (the premium "glow" effect)
      root.style.setProperty("--primary-shadow", `0 10px 30px rgba(${rgb}, 0.2)`);
      root.style.setProperty("--primary-border", `rgba(${rgb}, 0.1)`);
    } catch (e) {
      console.error("BrandingEngine: Failed to parse brand color", e);
    }

  }, [brandColor]);

  return null; // Side-effect only component
}
