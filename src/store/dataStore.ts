import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PROPERTIES as MockProperties, Property } from '@/data/properties';

export interface Booking {
  id: number;
  property_id: number;
  guest_name: string;
  guest_email: string;
  check_in: string;
  check_out: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  total_price: number;
  adults: number;
  children: number;
  created_at: string;
  property?: Property;
}

const INITIAL_MOCK_BOOKINGS: Booking[] = [
  { id: 901, property_id: 1, guest_name: 'Mohammed Al Fayed', guest_email: 'mohammed@example.com', check_in: '2026-10-12', check_out: '2026-10-18', status: 'confirmed', total_price: 4200, adults: 4, children: 0, created_at: '2026-08-01T10:00:00Z', property: MockProperties.find(p => p.id === 1) },
  { id: 902, property_id: 2, guest_name: 'Sarah Jenkins', guest_email: 'sarah@example.com', check_in: '2026-10-20', check_out: '2026-10-25', status: 'pending', total_price: 1850, adults: 2, children: 0, created_at: '2026-08-05T14:30:00Z', property: MockProperties.find(p => p.id === 2) },
  { id: 903, property_id: 3, guest_name: 'Ahmed Hassan', guest_email: 'ahmed@example.com', check_in: '2026-11-01', check_out: '2026-11-10', status: 'confirmed', total_price: 12500, adults: 6, children: 2, created_at: '2026-08-10T09:15:00Z', property: MockProperties.find(p => p.id === 3) },
];

interface DataStore {
  properties: Property[];
  bookings: Booking[];
  siteContent: any[];
  setProperties: (props: Property[]) => void;
  setBookings: (books: Booking[]) => void;
  setSiteContent: (content: any[]) => void;
  updateProperty: (id: number, updates: Partial<Property>) => void;
  addProperty: (prop: Property) => void;
  updateBooking: (id: number, updates: Partial<Booking>) => void;
  addBooking: (book: Booking) => void;
}

export const useDataStore = create<DataStore>()(
  persist(
    (set) => ({
      properties: MockProperties,
      bookings: INITIAL_MOCK_BOOKINGS,
      siteContent: [],
      setProperties: (properties) => set({ properties }),
      setBookings: (bookings) => set({ bookings }),
      setSiteContent: (siteContent) => set({ siteContent }),
      updateProperty: (id, updates) => set((state) => ({
        properties: state.properties.map(p => p.id === id ? { ...p, ...updates } : p)
      })),
      addProperty: (prop) => set((state) => ({
        properties: [prop, ...state.properties]
      })),
      updateBooking: (id, updates) => set((state) => ({
        bookings: state.bookings.map(b => b.id === id ? { ...b, ...updates } : b)
      })),
      addBooking: (book) => set((state) => ({
        bookings: [book, ...state.bookings]
      })),
    }),
    {
      name: 'vista-data-persistence',
    }
  )
);
