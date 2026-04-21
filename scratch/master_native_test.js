// master_native_test.js
// This script simulates a booking and triggers the N8N dossier flow NATIVELY.

const { triggerN8NDossier } = require('./dist/lib/n8n'); // Note: This might need tsc first

// Mock Booking
const mockBooking = {
  id: "VST-TEST-888",
  booking_reference: "VST-TEST-888",
  guest_name: "Sherif - Vista Partner",
  guest_email: "sherif.seif@globevistahub.com",
  total_price: 5000,
  check_in: "2026-12-01",
  check_out: "2026-12-05",
  adults: 2,
  children: 0,
};

// Mock Property
const mockProperty = {
  title_en: "The Emerald Penthouse",
};

// Trigger
console.log("🚀 Starting Native PDF Generation Test...");
triggerN8NDossier(mockBooking, mockProperty)
  .then(() => console.log("✅ Test sequence complete."))
  .catch(err => console.error("❌ Test failed:", err));
