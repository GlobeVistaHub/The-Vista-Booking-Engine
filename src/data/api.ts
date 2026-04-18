import { supabase } from '@/lib/supabase';
import type { Property } from './properties';
import { useDataStore } from '@/store/dataStore';
import { useAppModeStore } from '@/store/appModeStore';

export interface Booking {
  id: string | number;
  property_id: string | number;
  guest_name: string;
  guest_email: string;
  check_in: string;
  check_out: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
  total_price: number;
  adults: number;
  children: number;
  payment_status?: 'pending' | 'paid' | 'failed';
  created_at: string;
  booking_reference?: string;
  property?: Property;
}


export interface SiteLabel {
  key: string;
  value_en: string;
  value_ar: string;
}

export const getSiteContent = async (): Promise<SiteLabel[]> => {
  const { data, error } = await supabase.from('site_content').select('*').order('key');
  return error ? [] : data || [];
};

export const updateSiteLabel = async (label: SiteLabel): Promise<boolean> => {
  const { error } = await supabase.from('site_content').upsert(label).eq('key', label.key);
  return !error;
};

// -------------------------------------------------------------------------
// Properties API
// -------------------------------------------------------------------------

export const addProperty = async (property: Partial<Property>): Promise<boolean> => {
  const isDemoMode = useAppModeStore.getState().isDemoMode;
  if (isDemoMode) {
    const id = Math.floor(Math.random() * 1000000);
    useDataStore.getState().addProperty({ ...property, id } as Property);
    return true;
  }
  const { error } = await supabase.from('properties').insert([property]);
  return !error;
};

export const getProperties = async (options?: { includeHidden?: boolean }): Promise<Property[]> => {
  const isDemoMode = useAppModeStore.getState().isDemoMode;

  if (isDemoMode) {
    // Return properties from local persistent store
    return useDataStore.getState().properties;
  }

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching properties:', error);
    return [];
  }

  // Map snake_case to camelCase
  return (data || []).map(p => ({
    ...p,
    baseGuests: p.base_guests,
    ownerPhone: p.owner_phone,
    ownerEmail: p.owner_email,
    isInstantBookable: p.is_instant_bookable,
    isBooked: p.is_booked
  }));
};

export const getPropertyById = async (id: string | number): Promise<Property | null> => {
  const isDemoMode = useAppModeStore.getState().isDemoMode;

  if (isDemoMode) {
    const props = useDataStore.getState().properties;
    return props.find(p => String(p.id) === String(id)) || null;
  }

  // Supabase integer columns need a numeric value — cast when possible
  const numericId = Number(id);
  const lookupId = !isNaN(numericId) ? numericId : id;

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', lookupId)
    .maybeSingle(); // maybeSingle returns null instead of throwing on 0 rows

  if (error) {
    console.error('[getPropertyById] Supabase error:', error.message);
    return null;
  }
  if (!data) return null;

  return {
    ...data,
    baseGuests: data.base_guests,
    ownerPhone: data.owner_phone,
    ownerEmail: data.owner_email,
    isInstantBookable: data.is_instant_bookable,
    isBooked: data.is_booked
  };
};

// -------------------------------------------------------------------------
// Bookings API
// -------------------------------------------------------------------------

export const getBookings = async (): Promise<Booking[]> => {
  const isDemoMode = useAppModeStore.getState().isDemoMode;

  const { data: liveBookings, error } = await supabase
    .from('bookings')
    .select('*, property:properties(*)')
    .order('created_at', { ascending: false });

  if (error) console.error('Error fetching live bookings:', error);

  const mappedLive = (liveBookings || []).map(b => ({
    ...b,
    status: (b.status ?? 'pending') as Booking['status'],
    payment_status: (b.payment_status ?? 'pending') as Booking['payment_status'],
    property: b.property ? {
      ...b.property,
      baseGuests: b.property.base_guests,
      ownerPhone: b.property.owner_phone,
      ownerEmail: b.property.owner_email,
      isInstantBookable: b.property.is_instant_bookable,
      isBooked: b.property.is_booked
    } : undefined
  }));


  if (isDemoMode) {
    const mockBookings = useDataStore.getState().bookings;
    const props = useDataStore.getState().properties;
    const mappedMocks = mockBookings.map(b => ({
      ...b,
      property: props.find(p => String(p.id) === String(b.property_id))
    }));

    return mappedMocks;
  }

  return mappedLive;
};

export const updateBookingStatus = async (id: string | number, status: 'pending' | 'confirmed' | 'cancelled', paymentStatus?: 'pending' | 'paid' | 'failed'): Promise<boolean> => {
  const isDemoMode = useAppModeStore.getState().isDemoMode;
  if (isDemoMode) {
    useDataStore.getState().updateBooking(id, { status, ...(paymentStatus && { payment_status: paymentStatus }) });
    return true;
  }
  const updateData: any = { status };
  if (paymentStatus) updateData.payment_status = paymentStatus;

  const { error } = await supabase.from('bookings').update(updateData).eq('id', id);
  return !error;
};

export const togglePropertyStatus = async (id: string | number, currentStatus: boolean): Promise<boolean> => {
  const isDemoMode = useAppModeStore.getState().isDemoMode;
  if (isDemoMode) {
    useDataStore.getState().updateProperty(id, { isBooked: !currentStatus });
    return true;
  }
  const { error } = await supabase.from('properties').update({ is_booked: !currentStatus }).eq('id', id);
  return !error;
};

export async function batchCreateProperties(properties: Partial<Property>[]) {
  const isDemoMode = useAppModeStore.getState().isDemoMode;

  // Prepare the data for both modes
  const baseMappedProps = properties.map(p => ({
    title: p.title,
    title_ar: p.title_ar || p.title,
    type: p.type || "Villa",
    location: p.location || "Red Sea",
    location_ar: p.location_ar || p.location,
    price: Number(p.price || 0),
    base_guests: Number(p.baseGuests || 0),
    guests: String(p.guests || "0"),
    bedrooms: String(p.bedrooms || "0"),
    images: Array.isArray(p.images) ? p.images : [],
    tags: p.tags || [],
    description_en: p.description_en || "",
    description_ar: p.description_ar || "",
    lat: Number(p.lat || 27.257),
    lng: Number(p.lng || 33.811),
    owner_phone: p.ownerPhone || "+201145551163",
    owner_email: p.ownerEmail || useAppModeStore.getState().supportEmail || "support@globevistahub.com",
    is_instant_bookable: p.isInstantBookable ?? false,
    is_booked: p.isBooked || false,
    rating: Number(p.rating || 5.0),
    reviews: Number(p.reviews || 0),
  }));

  if (isDemoMode) {
    const existingProps = useDataStore.getState().properties;
    
    // Fallback ID generation for properties without an ID in the CSV
    const numericIds = existingProps.map(p => Number(p.id)).filter(id => !isNaN(id));
    let nextId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;

    const newProps = properties.map((p, idx) => {
      const propId = p.id || nextId++;
      return {
        ...baseMappedProps[idx],
        id: propId,
        baseGuests: baseMappedProps[idx].base_guests, // Map back to camelCase for store
        ownerPhone: baseMappedProps[idx].owner_phone,
        ownerEmail: baseMappedProps[idx].owner_email,
        isInstantBookable: baseMappedProps[idx].is_instant_bookable,
        isBooked: baseMappedProps[idx].is_booked
      };
    }) as Property[];

    useDataStore.getState().setProperties([...newProps, ...existingProps]);
    return true;
  }

  // LIVE MODE: Strip IDs to let Supabase handle the auto-increment
  // This prevents the "ID is text" rejection error
  const { error } = await supabase.from('properties').insert(baseMappedProps);
  
  if (error) {
    console.error("Supabase Bulk Insert Error:", error);
    return false;
  }
  return true;
}

export const deleteAllProperties = async (): Promise<boolean> => {
  const isDemoMode = useAppModeStore.getState().isDemoMode;

  if (isDemoMode) {
    useDataStore.getState().setProperties([]);
    return true;
  }

  const { error } = await supabase.from('properties').delete().neq('id', '0');
  return !error;
};

export const deleteProperty = async (id: string | number): Promise<boolean> => {
  const isDemoMode = useAppModeStore.getState().isDemoMode;

  if (isDemoMode) {
    const props = useDataStore.getState().properties;
    useDataStore.getState().setProperties(props.filter(p => String(p.id) !== String(id)));
    return true;
  }

  const { error } = await supabase.from('properties').delete().eq('id', id);
  return !error;
};

export async function createBooking(booking: Omit<Booking, 'id'>) {
  const isDemoMode = useAppModeStore.getState().isDemoMode;

  if (isDemoMode) {
    const bookingId = Math.floor(Math.random() * 1000000);
    const newBooking: Booking = {
      ...booking,
      id: bookingId,
      created_at: new Date().toISOString()
    };
    useDataStore.getState().addBooking(newBooking as any);
    return { data: newBooking, error: null };
  }

  return await supabase.from('bookings').insert([booking]).select().single();
}
