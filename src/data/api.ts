import { supabase } from '@/lib/supabase';
import { Property } from '@/data/properties';
import { useDemoStore } from '@/store/demoStore';
import { useDataStore, Booking } from '@/store/dataStore';

/**
 * Technical Recommendation Logic for Sorting
 * Reliability Score = (Rating * Log10(Reviews + 1))
 * This balances high ratings with the confidence of high review counts.
 */
const getReliabilityScore = (p: Property) => {
  return p.rating * Math.log10((p.reviews || 0) + 1);
};

const sortProperties = (props: Property[]) => {
  return [...props].sort((a, b) => {
    // 1st Layer: Instant Booking Priority
    const aInstant = a.isInstantBookable || a.tags?.includes('tagInstantBook');
    const bInstant = b.isInstantBookable || b.tags?.includes('tagInstantBook');
    
    if (aInstant && !bInstant) return -1;
    if (!aInstant && bInstant) return 1;

    // 2nd Layer: Reliability Score (Rating + Volume)
    return getReliabilityScore(b) - getReliabilityScore(a);
  });
};

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
    tags: row.tags || [],
    description_en: row.description_en,
    description_ar: row.description_ar,
    lat: row.lat,
    lng: row.lng,
    type: row.type,
    ownerPhone: row.owner_phone,
    isBooked: row.is_booked,
    isInstantBookable: row.is_instant_bookable
  };
};

/**
 * Master Traffic Controller
 */
export const getProperties = async (options?: { includeHidden?: boolean }): Promise<Property[]> => {
  const isDemoMode = useDemoStore.getState().isDemoMode;

  if (isDemoMode) {
    const mockData = useDataStore.getState().properties;
    const filtered = options?.includeHidden ? mockData : mockData.filter(p => !p.isBooked);
    return sortProperties(filtered);
  }

  let query = supabase.from('properties').select('*');
  if (!options?.includeHidden) {
    query = query.eq('is_booked', false);
  }

  const { data, error } = await query;
  if (error) return [];
  
  const mapped = data.map(mapDatabaseToProperty);
  return sortProperties(mapped);
};

/**
 * Add a new property
 */
export const addProperty = async (property: Omit<Property, 'id' | 'rating' | 'reviews'>): Promise<Property | null> => {
  const isDemoMode = useDemoStore.getState().isDemoMode;

  if (isDemoMode) {
    const existingProps = useDataStore.getState().properties;
    const newId = existingProps.length > 0 ? Math.max(...existingProps.map(p => p.id)) + 1 : 1;
    const newProp = { 
      ...property, 
      id: newId, 
      rating: 5.0, 
      reviews: 0,
      tags: property.isInstantBookable ? [...(property.tags || []), 'tagInstantBook'] : (property.tags || [])
    } as Property;
    
    useDataStore.getState().addProperty(newProp);
    return newProp;
  }

  const { data, error } = await supabase
    .from('properties')
    .insert([{
      title: property.title,
      title_ar: property.title_ar,
      guests: property.guests,
      base_guests: property.baseGuests,
      bedrooms: property.bedrooms,
      location: property.location,
      location_ar: property.location_ar,
      price: property.price,
      images: property.images,
      tags: property.isInstantBookable ? [...(property.tags || []), 'tagInstantBook'] : (property.tags || []),
      description_en: property.description_en,
      description_ar: property.description_ar,
      lat: property.lat,
      lng: property.lng,
      type: property.type,
      owner_phone: property.ownerPhone,
      is_booked: property.isBooked ?? false,
      is_instant_bookable: property.isInstantBookable ?? false,
      rating: 5.0,
      reviews: 0
    }])
    .select()
    .single();

  if (error || !data) return null;
  return mapDatabaseToProperty(data);
};

export const getPropertyById = async (id: number): Promise<Property | null> => {
  const isDemoMode = useDemoStore.getState().isDemoMode;
  if (isDemoMode) {
    return useDataStore.getState().properties.find(p => p.id === id) || null;
  }
  const { data, error } = await supabase.from('properties').select('*').eq('id', id).single();
  if (error || !data) return null;
  return mapDatabaseToProperty(data);
};

// ============================================================================
// PHASE 3: BOOKINGS ENGINE
// ============================================================================

export type { Booking };

export const getBookings = async (): Promise<Booking[]> => {
  const isDemoMode = useDemoStore.getState().isDemoMode;
  if (isDemoMode) {
    const bookings = useDataStore.getState().bookings;
    const props = useDataStore.getState().properties;
    return bookings.map(b => ({
      ...b,
      property: props.find(p => p.id === b.property_id)
    }));
  }

  const { data, error } = await supabase
    .from('bookings')
    .select('*, properties(*)')
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data.map((row: any) => ({
    ...row,
    property: row.properties ? mapDatabaseToProperty(row.properties) : undefined
  })) as Booking[];
};

export const updateBookingStatus = async (id: number, status: 'pending' | 'confirmed' | 'cancelled'): Promise<boolean> => {
  const isDemoMode = useDemoStore.getState().isDemoMode;
  if (isDemoMode) {
    useDataStore.getState().updateBooking(id, { status });
    return true;
  }
  const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
  return !error;
};

export const togglePropertyStatus = async (id: number, currentStatus: boolean): Promise<boolean> => {
  const isDemoMode = useDemoStore.getState().isDemoMode;
  if (isDemoMode) {
    useDataStore.getState().updateProperty(id, { isBooked: !currentStatus });
    return true;
  }
  const { error } = await supabase.from('properties').update({ is_booked: !currentStatus }).eq('id', id);
  return !error;
};
