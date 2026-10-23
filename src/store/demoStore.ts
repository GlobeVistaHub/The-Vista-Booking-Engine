import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DemoStore {
  isDemoMode: boolean;
  setDemoMode: (val: boolean) => void;
}

export const useDemoStore = create<DemoStore>()(
  persist(
    (set) => ({
      // Default to the .env file's hardcoded setting on first load
      isDemoMode: process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true',
      setDemoMode: (val) => set({ isDemoMode: val }),
    }),
    {
      name: 'vista-demo-storage',
    }
  )
);
