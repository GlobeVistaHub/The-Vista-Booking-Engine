import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { formatPrice, dateKeyOf, formatTimeRange, refundEligibility } from "@/lib/schedule";
import CustomerBookings from "@/components/customer/CustomerBookings";
import MagicLinkLogin from "@/components/customer/MagicLinkLogin";
import { createAdminClient } from "@/utils/supabase/admin";
import Link from "next/link";

export const metadata = {
  title: "My Bookings - Auto-Bath",
  description: "Manage your Auto-Bath appointments.",
};

export default async function MyBookingsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-neutral-100">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block text-2xl font-black tracking-tighter text-neutral-900 mb-6">
              AUTO-BATH
            </Link>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">My Bookings</h1>
            <p className="text-neutral-500">Enter the email you used to book, and we'll send you a secure login link.</p>
          </div>
          <MagicLinkLogin />
        </div>
      </main>
    );
  }

  // User is logged in, fetch their bookings. 
  // We use admin client because RLS might not be fully configured for 'services' table joins for normal users.
  // Actually, they can only see their own bookings if RLS allows, but doing it via admin guarantees we get the data,
  // and we filter strictly by user.id
  const admin = createAdminClient();
  const { data: rawBookings, error } = await admin
    .from("bookings")
    .select(`
      id, 
      status, 
      scheduled_time, 
      vehicle_make,
      services(name, base_price)
    `)
    .eq("user_id", user.id)
    .order("scheduled_time", { ascending: false });

  if (error) {
    console.error("Error fetching customer bookings:", error);
  }

  // Format bookings for the client component
  const bookings = (rawBookings || []).map(b => {
    const { eligible } = refundEligibility(b.scheduled_time);
    
    return {
      id: b.id,
      status: b.status,
      scheduledTime: b.scheduled_time,
      vehicle: b.vehicle_make,
      serviceName: (b.services as any)?.name || 'Service',
      priceCents: (b.services as any)?.base_price || 0,
      refundEligible: eligible
    };
  });

  return (
    <main className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="inline-block text-xl font-black tracking-tighter text-neutral-900 mb-2">
              AUTO-BATH
            </Link>
            <h1 className="text-3xl font-bold text-neutral-900">Your Appointments</h1>
          </div>
          <form action="/auth/signout" method="post">
            <button className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
              Sign Out
            </button>
          </form>
        </div>

        <CustomerBookings bookings={bookings} />
      </div>
    </main>
  );
}
