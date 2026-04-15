import { supabase } from '@/lib/supabase';
import { PROPERTIES as MockProperties, Property } from '@/data/properties';
import { useDemoStore } from '@/store/demoStore';

/**
 * Helper to convert Supabase snake_case rows to our frontend camelCase Property interface
 */
const mapDatabaseToProperty = (row: any): Property => {
  return {
    id: row.id,
    title: row.title,
    title_ar: row.title_ar,
    guests: row.guests,
    baseGuests: row.base_guests,
    bedrooms: row.bedrooms,
    location: row.location,
    location_ar: row.location_ar,
    price: row.price,
    rating: row.rating,
    reviews: row.reviews,
    images: row.images,
    tags: row.tags,
    description_en: row.description_en,
    description_ar: row.description_ar,
    lat: row.lat,
    lng: row.lng,
    type: row.type,
    ownerPhone: row.owner_phone,
    isBooked: row.is_booked
  };
};

/**
 * Master Traffic Controller
 * Determines whether to serve Mock Data or Live Supabase Data
 */
export const getProperties = async (): Promise<Property[]> => {
  const isDemoMode = useDemoStore.getState().isDemoMode;

  // If the master toggle is ON, serve the beautiful mock data
  if (isDemoMode) {
    return MockProperties;
  }

  // Otherwise, fetch from Live Supabase
  const { data, error } = await supabase.from('properties').select('*');

  if (error) {
    console.error("Supabase Error fetching properties:", error);
    // Graceful fallback if database fails
    return MockProperties;
  }

  if (!data) return [];

  // Convert to our strict TypeScript format
  return data.map(mapDatabaseToProperty);
};

export const getPropertyById = async (id: number): Promise<Property | null> => {
  const isDemoMode = useDemoStore.getState().isDemoMode;

  if (isDemoMode) {
    return MockProperties.find(p => p.id === id) || null;
  }

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error(`Supabase Error fetching property ${id}:`, error);
    return null;
  }

  return mapDatabaseToProperty(data);
};

// ============================================================================
// PHASE 3: BOOKINGS ENGINE
// ============================================================================

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
  property?: Property; // Joined relation
}

// Temporary rich mock data for the Presentation Data Engine
const MOCK_BOOKINGS: Booking[] = [
  { id: 901, property_id: 1, guest_name: 'Mohammed Al Fayed', guest_email: 'mohammed@example.com', check_in: '2026-10-12', check_out: '2026-10-18', status: 'confirmed', total_price: 4200, adults: 4, children: 0, created_at: '2026-08-01T10:00:00Z', property: MockProperties.find(p => p.id === 1) },
  { id: 902, property_id: 2, guest_name: 'Sarah Jenkins', guest_email: 'sarah@example.com', check_in: '2026-10-20', check_out: '2026-10-25', status: 'pending', total_price: 1850, adults: 2, children: 0, created_at: '2026-08-05T14:30:00Z', property: MockProperties.find(p => p.id === 2) },
  { id: 903, property_id: 3, guest_name: 'Ahmed Hassan', guest_email: 'ahmed@example.com', check_in: '2026-11-01', check_out: '2026-11-10', status: 'confirmed', total_price: 12500, adults: 6, children: 2, created_at: '2026-08-10T09:15:00Z', property: MockProperties.find(p => p.id === 3) },
];

export const getBookings = async (): Promise<Booking[]> => {
  const isDemoMode = useDemoStore.getState().isDemoMode;

  if (isDemoMode) {
    return MOCK_BOOKINGS;
  }

  // Fetch bookings WITH the linked property details
  const { data, error } = await supabase
    .from('bookings')
    .select('*, properties(*)')
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.error("Supabase Error fetching bookings:", error);
    return [];
  }

  // Format the joined data
  return data.map((row: any) => ({
    id: row.id,
    property_id: row.property_id,
    guest_name: row.guest_name,
    guest_email: row.guest_email,
    check_in: row.check_in,
    check_out: row.check_out,
    status: row.status,
    total_price: row.total_price,
    adults: row.adults,
    children: row.children,
    created_at: row.created_at,
    property: row.properties ? mapDatabaseToProperty(row.properties) : undefined
  })) as Booking[];
};

export const updateBookingStatus = async (id: number, status: 'pending' | 'confirmed' | 'cancelled'): Promise<boolean> => {
  const isDemoMode = useDemoStore.getState().isDemoMode;

  if (isDemoMode) {
    // In demo mode, simulate network delay then succeed
    await new Promise(resolve => setTimeout(resolve, 600));
    return true;
  }

  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error("Error updating booking status", error);
    return false;
  }

  return true;
};
