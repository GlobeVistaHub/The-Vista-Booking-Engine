/**
 * App Mode Store
 * Manages the global operating mode of The Vista platform.
 * Platform Mode: Operated as a multi-property marketplace.
 * White Label Mode: Sold/deployed as a private SaaS for a single business owner.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppModeState {
  isWhiteLabel: boolean;
  brandName: string;
  ownerName: string;
  setWhiteLabel: (val: boolean) => void;
  setBrandName: (name: string) => void;
  setOwnerName: (name: string) => void;
}

export const useAppModeStore = create<AppModeState>()(
  persist(
    (set) => ({
      isWhiteLabel: false,
      brandName: 'The Vista',
      ownerName: 'Concierge',
      setWhiteLabel: (val) => set({ isWhiteLabel: val }),
      setBrandName: (name) => set({ brandName: name }),
      setOwnerName: (name) => set({ ownerName: name }),
    }),
    { name: 'vista-app-mode' }
  )
);
