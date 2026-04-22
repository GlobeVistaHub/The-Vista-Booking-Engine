import { supabase as defaultSupabase } from '@/lib/supabase';
import { createClerkSupabaseClient } from '@/utils/supabaseClient';
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
  confirmed_at?: string;
  cancelled_at?: string;
  booking_reference?: string;
  paymob_order_id?: string;
  paymob_transaction_id?: string;
  transaction_id?: string;
  paid_amount_egp?: number;
  conversion_rate_used?: number;
  property?: Property;
}


export interface SiteLabel {
  key: string;
  value_en: string;
  value_ar: string;
}

export const getSiteContent = async (clerkToken?: string): Promise<SiteLabel[]> => {
  const supabase = clerkToken ? createClerkSupabaseClient(clerkToken) : defaultSupabase;
  const { data, error } = await supabase.from('site_content').select('*').order('key');
  return error ? [] : data || [];
};

export const updateSiteLabel = async (label: SiteLabel, clerkToken?: string): Promise<boolean> => {
  const supabase = createClerkSupabaseClient(clerkToken);
  const { error } = await supabase.from('site_content').upsert(label);
  if (error) console.error("updateSiteLabel Error:", error);
  return !error;
};

// -------------------------------------------------------------------------
// Properties API
// -------------------------------------------------------------------------

export const addProperty = async (property: Partial<Property>, clerkToken?: string): Promise<boolean> => {
  const isDemoMode = useAppModeStore.getState().isDemoMode;
  if (isDemoMode) {
    const id = Math.floor(Math.random() * 1000000);
    useDataStore.getState().addProperty({ ...property, id } as Property);
    return true;
  }
  const supabase = createClerkSupabaseClient(clerkToken);
  const { error } = await supabase.from('properties').insert([property]);
  return !error;
};

export const getProperties = async (options?: { includeHidden?: boolean }, clerkToken?: string): Promise<Property[]> => {
  const isDemoMode = useAppModeStore.getState().isDemoMode;

  if (isDemoMode) {
    const props = useDataStore.getState().properties;
    if (!options?.includeHidden) {
      return props.filter(p => !p.isBooked);
    }
    return props;
  }

  const supabase = clerkToken ? createClerkSupabaseClient(clerkToken) : defaultSupabase;
  // We fetch all properties. The UI will handle the 'Booked' banner logic.
  let query = supabase.from('properties').select('*');

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching properties:', error);
    return [];
  }

  return (data || []).map(p => ({
    ...p,
    baseGuests: p.base_guests,
    ownerPhone: p.owner_phone,
    ownerEmail: p.owner_email,
    isInstantBookable: p.is_instant_bookable,
    isBooked: p.is_booked,
    cleaningFeeOverride: p.cleaning_fee_override,
    serviceFeeOverride: p.service_fee_override,
    extraGuestFeeOverride: p.extra_guest_fee_override
  }));
};

export const getPropertyById = async (id: string | number, options?: { includeHidden?: boolean }, clerkToken?: string): Promise<Property | null> => {
  const isDemoMode = useAppModeStore.getState().isDemoMode;

  if (isDemoMode) {
    const props = useDataStore.getState().properties;
    return props.find(p => String(p.id) === String(id)) || null;
  }

  const numericId = Number(id);
  const lookupId = !isNaN(numericId) ? numericId : id;

  const supabase = clerkToken ? createClerkSupabaseClient(clerkToken) : defaultSupabase;
  let query = supabase
    .from('properties')
    .select('*')
    .eq('id', lookupId);

  if (options?.includeHidden === false) {
    query = query.eq('is_booked', false);
  }

  const { data, error } = await query.maybeSingle();

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

export const getBookings = async (clerkToken?: string): Promise<Booking[]> => {
  const isDemoMode = useAppModeStore.getState().isDemoMode;

  if (isDemoMode) {
    const mockBookings = useDataStore.getState().bookings;
    const props = useDataStore.getState().properties;
    return mockBookings.map(b => ({
      ...b,
      property: props.find(p => String(p.id) === String(b.property_id))
    }));
  }

  const supabase = createClerkSupabaseClient(clerkToken);
  const { data, error } = await supabase
    .from('bookings')
    .select('*, property:properties(*)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[getBookings] Supabase error:', error.message);
    return [];
  }

  return (data || []).map(b => {
    const propData = Array.isArray(b.property) ? b.property[0] : b.property;
    return {
      ...b,
      status: (b.status ?? 'pending') as Booking['status'],
      payment_status: (b.payment_status ?? 'pending') as Booking['payment_status'],
      property: propData ? {
        ...propData,
        baseGuests: propData.base_guests,
        ownerPhone: propData.owner_phone,
        ownerEmail: propData.owner_email,
        isInstantBookable: propData.is_instant_bookable,
        isBooked: propData.is_booked
      } : undefined
    };
  });
};

/**
 * Privacy Shield: Returns only basic occupancy data for public site.
 * No guest names, no emails. Just ID + Dates.
 */
export const getPublicOccupiedDates = async (): Promise<{ property_id: string | number, check_in: string, check_out: string }[]> => {
  const isDemoMode = useAppModeStore.getState().isDemoMode;
  if (isDemoMode) {
    return useDataStore.getState().bookings
      .filter(b => b.status === 'confirmed')
      .map(b => ({ property_id: b.property_id, check_in: b.check_in, check_out: b.check_out }));
  }

  try {
    const { data, error } = await defaultSupabase
      .from('bookings')
      .select('property_id, check_in, check_out')
      .eq('status', 'confirmed');

    if (error) {
      console.warn('[Vista-Diagnostics] Security block on public bookings:', error.message);
      return [];
    }
    
    if (!data || data.length === 0) {
      console.log('[Vista-Diagnostics] Public occupancy query returned 0 results. Checking if this is an RLS issue...');
    }

    return data || [];
  } catch (err) {
    console.error('[Vista-Diagnostics] Fatal failure in public date query:', err);
    return [];
  }
};

export const updateBookingStatus = async (id: string | number, status: 'pending' | 'confirmed' | 'cancelled', paymentStatus?: 'pending' | 'paid' | 'failed', clerkToken?: string): Promise<boolean> => {
  const isDemoMode = useAppModeStore.getState().isDemoMode;
  if (isDemoMode) {
    useDataStore.getState().updateBooking(id, { status, ...(paymentStatus && { payment_status: paymentStatus }) });
    return true;
  }
  const updateData: any = { status };
  if (paymentStatus) updateData.payment_status = paymentStatus;
  
  if (status === 'confirmed') updateData.confirmed_at = new Date().toISOString();
  if (status === 'cancelled') updateData.cancelled_at = new Date().toISOString();

  const supabase = createClerkSupabaseClient(clerkToken);
  const { error } = await supabase.from('bookings').update(updateData).eq('id', id);
  return !error;
};

export const updatePropertyOverrides = async (id: string | number, overrides: { cleaningFee?: number, serviceFeeRate?: number, extraGuestFee?: number }, clerkToken?: string): Promise<boolean> => {
  const isDemoMode = useAppModeStore.getState().isDemoMode;
  if (isDemoMode) {
    useDataStore.getState().updateProperty(id, {
      cleaningFeeOverride: overrides.cleaningFee,
      serviceFeeOverride: overrides.serviceFeeRate,
      extraGuestFeeOverride: overrides.extraGuestFee
    });
    return true;
  }
  
  const updateData = {
    cleaning_fee_override: overrides.cleaningFee,
    service_fee_override: overrides.serviceFeeRate,
    extra_guest_fee_override: overrides.extraGuestFee
  };

  const supabase = createClerkSupabaseClient(clerkToken);
  const { error } = await supabase.from('properties').update(updateData).eq('id', id);
  return !error;
};

export const togglePropertyStatus = async (id: string | number, currentStatus: boolean, clerkToken?: string): Promise<boolean> => {
  const isDemoMode = useAppModeStore.getState().isDemoMode;
  if (isDemoMode) {
    useDataStore.getState().updateProperty(id, { isBooked: !currentStatus });
    return true;
  }
  const supabase = createClerkSupabaseClient(clerkToken);
  const { error } = await supabase.from('properties').update({ is_booked: !currentStatus }).eq('id', id);
  return !error;
};

export async function batchCreateProperties(properties: Partial<Property>[], clerkToken?: string) {
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
  const supabase = createClerkSupabaseClient(clerkToken);
  const { error } = await supabase.from('properties').insert(baseMappedProps);
  
  if (error) {
    console.error("Supabase Bulk Insert Error:", error);
    return false;
  }
  return true;
}

export const deleteAllProperties = async (clerkToken?: string): Promise<boolean> => {
  const isDemoMode = useAppModeStore.getState().isDemoMode;

  if (isDemoMode) {
    useDataStore.getState().setProperties([]);
    return true;
  }

  const supabase = createClerkSupabaseClient(clerkToken);
  const { error } = await supabase.from('properties').delete().neq('id', '0');
  return !error;
};

export const deleteProperty = async (id: string | number, clerkToken?: string): Promise<boolean> => {
  const isDemoMode = useAppModeStore.getState().isDemoMode;

  if (isDemoMode) {
    const props = useDataStore.getState().properties;
    useDataStore.getState().setProperties(props.filter(p => String(p.id) !== String(id)));
    return true;
  }

  const supabase = createClerkSupabaseClient(clerkToken);
  const { error } = await supabase.from('properties').delete().eq('id', id);
  return !error;
};

export const createBooking = async (booking: Omit<Booking, "id" | "booking_reference" | "created_at">, clerkToken?: string): Promise<Booking | null> => {
  const isDemoMode = useAppModeStore.getState().isDemoMode;

  if (isDemoMode) {
    const newBooking: Booking = {
      ...booking,
      id: Math.floor(Math.random() * 10000),
      booking_reference: `BK-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      created_at: new Date().toISOString()
    };
    useDataStore.getState().addBooking(newBooking as any);
    return newBooking;
  }

  try {
    const supabase = clerkToken ? createClerkSupabaseClient(clerkToken) : defaultSupabase;
    const { data, error } = await supabase.from('bookings').insert([booking]).select().single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Supabase createBooking error:", err);
    return null;
  }
};
