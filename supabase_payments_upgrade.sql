-- Step 1: Add financial tracking columns to the bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS paymob_order_id BIGINT,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
ADD COLUMN IF NOT EXISTS paid_amount_egp NUMERIC,
ADD COLUMN IF NOT EXISTS payment_method TEXT; -- e.g., 'card', 'kiosk', 'wallet'

-- Step 2: Add index for faster reconciliation
CREATE INDEX IF NOT EXISTS idx_bookings_paymob_order ON bookings(paymob_order_id);

-- Step 3: Optional: Add a column for the exchange rate used at the time of booking
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS conversion_rate_used NUMERIC DEFAULT 50.0;
