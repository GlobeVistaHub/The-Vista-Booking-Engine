"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Plus, Loader2, CalendarDays, Wallet, Clock } from "lucide-react";
import SystemControlToggle from "@/components/SystemControlToggle";
import { getBookings, getProperties, Booking } from "@/data/api";
import { format, parseISO } from "date-fns";
import { useLanguage } from "@/context/LanguageContext";
import { useAppModeStore } from "@/store/appModeStore";
import AddPropertyModal from "@/components/admin/AddPropertyModal";

export default function AdminPage() {
  const { lang } = useLanguage();
  const { isWhiteLabel, ownerName } = useAppModeStore();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [totalProperties, setTotalProperties] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    const [bookingsData, propertiesData] = await Promise.all([
      getBookings(),
      getProperties({ includeHidden: true })
    ]);
    setBookings(bookingsData);
    setTotalProperties(propertiesData.length);
    setIsLoading(false);
  };

  // ── Stats Calculations ──────────────────────────────────────────
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.total_price, 0);
  
  // Recent activity (last 5)
  const recentBookings = bookings.slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
      
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading text-navy font-bold">
            Welcome back, <span className="text-primary">{isWhiteLabel ? ownerName : "Concierge"}</span>.
          </h1>
          <p className="text-muted mt-2">Here is a real-time overview of your luxury portfolio.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-primary text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 hover:-translate-y-0.5 active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add New Property
        </button>
      </div>

      {/* 2. System Control Toggle (Live vs Demo Mode) */}
      <SystemControlToggle />

      {/* 3. The KPI Metrics (Top Row) */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-soft border border-navy/5 animate-pulse h-32" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-navy">
          <div className="bg-white p-6 rounded-2xl shadow-soft border border-navy/5 relative overflow-hidden group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Wallet className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-muted uppercase tracking-wider">Total Revenue</p>
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-heading font-black">${totalRevenue.toLocaleString()}</h3>
              <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg text-xs font-black">
                <TrendingUp className="w-3.5 h-3.5" />
                12%
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-soft border border-navy/5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <CalendarDays className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-muted uppercase tracking-wider">Active Bookings</p>
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-heading font-black">{confirmedBookings.length}</h3>
              <span className="text-[10px] bg-slate-100 px-2 py-1 rounded-md font-bold text-muted uppercase">Confirmed</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-soft border border-navy/5 relative overflow-hidden">
            {pendingBookings.length > 0 && (
              <div className="absolute top-6 right-6 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
            )}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Clock className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-muted uppercase tracking-wider">Pending Approvals</p>
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-heading font-black">{pendingBookings.length}</h3>
              <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase ${pendingBookings.length > 0 ? "bg-red-50 text-red-600" : "bg-slate-100 text-muted"}`}>
                {pendingBookings.length > 0 ? "Priority" : "All Clear"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. The Recent Bookings Table (Bottom Section) */}
      <div className="bg-white rounded-2xl shadow-soft border border-navy/5 overflow-hidden">
        <div className="p-6 border-b border-navy/5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-navy">Recent Activity</h2>
          <span className="text-[10px] font-black uppercase tracking-widest text-muted">Latest Operations</span>
        </div>
        
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 text-primary/40 animate-spin" />
          </div>
        ) : recentBookings.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-muted font-medium">No recent activity detected.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-muted border-b border-navy/5">
                  <th className="px-6 py-4 font-bold text-[11px] uppercase tracking-wider">Guest Name</th>
                  <th className="px-6 py-4 font-bold text-[11px] uppercase tracking-wider">Property</th>
                  <th className="px-6 py-4 font-bold text-[11px] uppercase tracking-wider">Dates</th>
                  <th className="px-6 py-4 font-bold text-[11px] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 font-bold text-[11px] uppercase tracking-wider text-right">Total</th>
                </tr>
              </thead>
              <tbody className="text-navy divide-y divide-navy/5">
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/40 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-navy text-sm">{booking.guest_name}</p>
                      <p className="text-[10px] text-muted truncate max-w-[150px]">{booking.guest_email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium">
                        {lang === 'ar' && booking.property ? booking.property.title_ar : (booking.property?.title || `Property #${booking.property_id}`)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-navy/70 whitespace-nowrap">
                          {format(parseISO(booking.check_in), "MMM dd")} - {format(parseISO(booking.check_out), "MMM dd")}
                        </span>
                        <span className="text-[10px] text-muted uppercase font-black tracking-tighter">
                          {booking.adults + booking.children} Persons
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                        booking.status === 'confirmed' 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                          : booking.status === 'pending'
                          ? "bg-amber-50 text-amber-700 border-amber-100"
                          : "bg-red-50 text-red-700 border-red-100"
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-black text-right text-sm">
                      ${booking.total_price.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddPropertyModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchDashboardData()}
      />
    </div>
  );
}
