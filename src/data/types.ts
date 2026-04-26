import type { Property } from './properties';

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
