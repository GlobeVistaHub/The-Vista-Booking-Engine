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
