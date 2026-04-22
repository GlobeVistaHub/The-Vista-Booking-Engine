import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AppModeState {
  isWhiteLabel: boolean;
  brandName: string;
  brandLogo: string;
  brandColor: string;
  ownerName: string;
  exchangeRate: number;
  supportEmail: string;
  isDemoMode: boolean;
  setWhiteLabel: (val: boolean) => void;
  setDemoMode: (val: boolean) => void;
  setBrandName: (name: string) => void;
  setBrandLogo: (logo: string) => void;
  setBrandColor: (color: string) => void;
  setOwnerName: (name: string) => void;
  setExchangeRate: (rate: number) => void;
  setSupportEmail: (email: string) => void;
}

export const useAppModeStore = create<AppModeState>()(
  persist(
    (set) => ({
      isWhiteLabel: false,
      brandName: 'The Vista',
      brandLogo: '',
      brandColor: '#1A237E', // Default Navy
      ownerName: 'Concierge',
      exchangeRate: 50.0,
      supportEmail: 'support@globevistahub.com',
      isDemoMode: false,
      setWhiteLabel: (val) => set({ isWhiteLabel: val }),
      setDemoMode: (val) => set({ isDemoMode: val }),
      setBrandName: (name) => set({ brandName: name }),
      setBrandLogo: (logo) => set({ brandLogo: logo }),
      setBrandColor: (color) => set({ brandColor: color }),
      setOwnerName: (name) => set({ ownerName: name }),
      setExchangeRate: (rate) => set({ exchangeRate: rate }),
      setSupportEmail: (email) => set({ supportEmail: email }),
    }),
    { name: 'vista-app-mode' }
  )
);
