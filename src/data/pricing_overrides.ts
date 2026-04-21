/**
 * GHOST PRICING REGISTRY
 * 
 * This file handles manual pricing overrides for properties without 
 * affecting the core database schema or bulk upload templates.
 */

export interface PricingOverride {
  cleaningFee?: number;
  serviceFeeRate?: number;
  extraGuestFee?: number;
}

// THE GHOST MAP: Property ID -> Overrides
// This allows you to manually override fees for any house.
export const PRICING_OVERRIDES: Record<string | number, PricingOverride> = {
  // Example: 1: { cleaningFee: 500 }
};

// VISTA STANDARDS (Fallbacks if no override exists)
export const VISTA_DEFAULTS = {
  cleaningFee: 150,
  serviceFeeRate: 0.1,    // 10%
  extraGuestFee: 75,
  baseGuests: 2,          // Safe minimum fallback
};

/**
 * Smart helper to get the final fees for a property.
 * Priority: LocalStorage (Admin UI) > Hardcoded Overrides > Vista Standard
 */
export function getPricingSettings(property: any) {
  // 1. Check LocalStorage (for Admin UI manual overrides)
  let localOverride = {};
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(`pricing_override_${property.id}`);
      if (stored) localOverride = JSON.parse(stored);
    } catch (e) {
      console.error("Error reading pricing overrides", e);
    }
  }

  // 2. Check Hardcoded Overrides
  const hardOverride = PRICING_OVERRIDES[property.id] || {};
  
  // 3. Merge with defaults
  return {
    cleaningFee: (localOverride as any).cleaningFee ?? hardOverride.cleaningFee ?? property.cleaningFee ?? VISTA_DEFAULTS.cleaningFee,
    serviceFeeRate: (localOverride as any).serviceFeeRate ?? hardOverride.serviceFeeRate ?? property.serviceFeeRate ?? VISTA_DEFAULTS.serviceFeeRate,
    extraGuestFee: (localOverride as any).extraGuestFee ?? hardOverride.extraGuestFee ?? property.extraGuestFee ?? VISTA_DEFAULTS.extraGuestFee,
    // SMART BASE GUEST LOGIC: If missing or 0, default to total capacity, or 2 as a last resort.
    baseGuests: (localOverride as any).baseGuests 
      ?? hardOverride.baseGuests 
      ?? (property.baseGuests > 0 ? property.baseGuests : null)
      ?? (parseInt(String(property.guests)) > 0 ? parseInt(String(property.guests)) : VISTA_DEFAULTS.baseGuests),
    
    // FLEXIBLE MAX GUESTS: Always allow at least 12 guests so extra fees can be tested comfortably.
    maxGuests: Math.max(12, parseInt(String(property.guests)) || 0, hardOverride.baseGuests || 0, (localOverride as any).baseGuests || 0),
  };
}
