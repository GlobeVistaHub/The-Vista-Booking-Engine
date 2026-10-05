import { createAdminClient } from "@/utils/supabase/admin";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { CancelButton } from "@/components/ui/CancelButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabaseAdmin = createAdminClient();
  
  // Fetch real data from Supabase
  const { data: rawBookings, error } = await supabaseAdmin
    .from("bookings")
    .select(`
      id,
      scheduled_time,
      vehicle_make,
      status,
      services ( name, base_price ),
      profiles ( full_name )
    `)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching bookings:", error);
  }

  // Format data for the UI
  const bookings = (rawBookings || []).map((b: any) => {
    const dateObj = new Date(b.scheduled_time);
    return {
      id: b.id,
      name: b.profiles?.full_name || "Unknown Customer",
      vehicle: b.vehicle_make,
      service: b.services?.name || "Unknown Service",
      date: dateObj.toLocaleDateString('en-AU', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: dateObj.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }),
      status: b.status,
      price: b.services?.base_price ? (b.services.base_price / 100).toFixed(2) : "0.00",
    };
  });

  // Calculate simple KPIs
  const activeBookings = bookings.filter(b => b.status === 'confirmed').length;
  const failedBookings = bookings.filter(b => b.status === 'failed').length;
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + parseFloat(b.price), 0);

  return (
    <div className="p-8 md:p-12">
      <header className="mb-12">
        <h1 className="text-3xl font-heading font-bold text-white uppercase tracking-widest mb-2">CRM Overview</h1>
        <p className="text-white/50 font-sans text-sm">Monitor live bookings, revenue, and customer data.</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-electric-cyan/5 rounded-full blur-[50px] group-hover:bg-electric-cyan/10 transition-colors" />
          <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">Total Revenue</h3>
          <p className="text-4xl font-heading font-bold text-white">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-electric-cyan/5 rounded-full blur-[50px] group-hover:bg-electric-cyan/10 transition-colors" />
          <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">Confirmed Bookings</h3>
          <p className="text-4xl font-heading font-bold text-white">{activeBookings}</p>
        </div>
        <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-orange/5 rounded-full blur-[50px] group-hover:bg-cyber-orange/10 transition-colors" />
          <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">Failed Payments</h3>
          <p className="text-4xl font-heading font-bold text-white">{failedBookings}</p>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-lg font-heading font-bold text-white uppercase tracking-widest">Recent Transactions</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="px-6 py-4 text-xs font-bold text-white/30 uppercase tracking-widest border-b border-white/5">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-white/30 uppercase tracking-widest border-b border-white/5">Vehicle</th>
                <th className="px-6 py-4 text-xs font-bold text-white/30 uppercase tracking-widest border-b border-white/5">Service</th>
                <th className="px-6 py-4 text-xs font-bold text-white/30 uppercase tracking-widest border-b border-white/5">Schedule</th>
                <th className="px-6 py-4 text-xs font-bold text-white/30 uppercase tracking-widest border-b border-white/5">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-white/30 uppercase tracking-widest border-b border-white/5 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/30 text-sm">No records found. The database is empty.</td>
                </tr>
              ) : bookings.map((booking: any) => (
                <tr key={booking.id} className="hover:bg-white/[0.02] transition-colors border-b border-white/5 last:border-0">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-white">{booking.name}</p>
                    <p className="text-xs text-white/40">${booking.price}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-white/70">{booking.vehicle}</td>
                  <td className="px-6 py-4 text-sm text-white/70">{booking.service}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-white/70">{booking.date}</p>
                    <p className="text-xs text-white/40">{booking.time}</p>
                  </td>
                  <td className="px-6 py-4">
                    {booking.status === 'confirmed' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#25D366]/10 text-[#25D366] text-xs font-bold uppercase tracking-wider">
                        <CheckCircle size={12} /> Confirmed
                      </span>
                    )}
                    {booking.status === 'pending' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-white/70 text-xs font-bold uppercase tracking-wider">
                        <Clock size={12} /> Pending
                      </span>
                    )}
                    {booking.status === 'failed' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyber-orange/10 text-cyber-orange text-xs font-bold uppercase tracking-wider">
                        <XCircle size={12} /> Failed
                      </span>
                    )}
                    {booking.status === 'cancelled' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-wider">
                        <XCircle size={12} /> Cancelled
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {(booking.status === 'confirmed' || booking.status === 'pending') ? (
                      <CancelButton id={booking.id} />
                    ) : (
                      <span className="text-white/20 text-xs font-bold uppercase tracking-widest">Archived</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
