"use client";

import { useEffect, useState, useCallback } from "react";
import { getBookings, updateBookingStatus, togglePropertyStatus } from "@/data/api";
import type { Booking } from "@/data/types";
import { triggerDossierFromAdmin } from "@/app/actions/bookings";
import { format, parseISO, formatDistanceToNow } from "date-fns";
import { useAuth } from "@clerk/nextjs";
import { useAppModeStore } from "@/store/appModeStore";
import SystemControlToggle from "@/components/SystemControlToggle";
import { supabase } from "@/lib/supabase";
import {
  CalendarDays,
  Search,
  MapPin,
  Mail,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  ChevronDown
} from "lucide-react";
import Link from "next/link";

export default function BookingsDashboard() {
  const { isDemoMode } = useAppModeStore();
  const { getToken } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    const token = await getToken({ template: 'supabase' });
    const data = await getBookings(token || undefined);
    setBookings(data);
    setIsLoading(false);
  }, [getToken]);

  useEffect(() => {
    fetchBookings();

    // ENABLE REALTIME INTELLIGENCE
    // This ensures that failures and bookings update VISUALLY the second they happen.
    const channel = supabase
      .channel('bookings-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        () => {
          console.log("[Vista-Admin] Realtime update detected, refreshing list...");
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchBookings, isDemoMode]);

  const handleStatusChange = async (id: string | number, newStatus: 'pending' | 'confirmed' | 'cancelled') => {
    setUpdatingId(id);

    try {
      // 1. Find the booking and current status for transition checks
      const bookingToUpdate = bookings.find(b => String(b.id) === String(id));
      const currentStatus = bookingToUpdate?.status;

      // VERCEL FIX: Robust property ID detection
      const propertyId = bookingToUpdate?.property_id || (bookingToUpdate as any).property?.id;

      console.log(`[Vista-Admin] Flipping booking ${id} to ${newStatus}. Target Property: ${propertyId}`);

      // 2. Real Database Transaction (WAIT for completion)
      const token = await getToken({ template: 'supabase' }) || undefined;

      if (!token && !useAppModeStore.getState().isDemoMode) {
        alert("Session error: Could not retrieve a secure token from Clerk. Please refresh the page and try again.");
        setUpdatingId(null);
        return;
      }

      const success = await updateBookingStatus(id, newStatus, undefined, token);

      if (!success) {
        alert("Failed to update status in database. This is often due to permissions (RLS) or missing columns. Check your browser console (F12) for the specific error details.");
        setUpdatingId(null);
        return;
      }

      // 3. Side-Effect: Trigger N8N dossier workflow if confirmed
      if (currentStatus === 'pending' && newStatus === 'confirmed') {
        try {
          await triggerDossierFromAdmin(id.toString());
        } catch (err) {
          console.error("[Vista-Admin] N8N Trigger failed:", err);
        }
      }

      // 4. Finalize UI Sync
      await fetchBookings();
      alert(`Booking successfully ${newStatus}!`);

    } catch (err) {
      console.error("[Vista-Admin] Status change failed:", err);
      alert("An unexpected error occurred while updating the booking.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredBookings = bookings.filter(b =>
    b.guest_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.property?.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.id.toString().includes(searchQuery)
  );

  const getStatusConfig = (booking: Booking) => {
    if (booking.status === 'pending' && booking.payment_status === 'failed') {
      return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: Clock, label: 'Payment Failed' };
    }

    switch (booking.status) {
      case 'confirmed': return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle2, label: 'Confirmed' };
      case 'pending': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Clock, label: 'Pending' };
      case 'cancelled': return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: XCircle, label: 'CANCELLED' };
      default: return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', icon: Clock, label: 'Unknown' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-20">

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading text-navy font-bold flex items-center gap-3">
            <CalendarDays className="w-8 h-8 text-primary" />
            Reservations
          </h1>
          <p className="text-muted mt-2">Manage your property bookings, approve requests, and monitor your pipeline.</p>
        </div>
      </div>

      {/* System Control Toggle (Live vs Demo Mode) */}
      <SystemControlToggle />

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-soft border border-navy/5 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search by guest name, property, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-v-background border border-navy/10 rounded-xl focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
          />
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-navy/70">
          Active Bookings: <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-bold">
            {bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length}
          </span>
        </div>
      </div>

      {/* The Content Area */}
      <div className="bg-white rounded-2xl shadow-soft border border-navy/5 overflow-hidden">
        {isLoading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-primary/40 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-primary/70 rounded-full animate-pulse delay-75"></div>
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse delay-150"></div>
            </div>
            <p className="text-muted font-medium text-sm animate-pulse">Syncing pipeline...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="py-24 text-center px-4">
            <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <CalendarDays className="w-10 h-10 text-primary/40" />
            </div>
            <h3 className="text-xl font-bold text-navy mb-2">No Bookings Found</h3>
            <p className="text-muted max-w-sm mx-auto">We couldn't find any reservations matching your search criteria.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-navy border-b border-navy/5">
                    <th className="px-6 py-5 font-bold text-[11px] uppercase tracking-wider text-muted">Guest ID</th>
                    <th className="px-6 py-5 font-bold text-[11px] uppercase tracking-wider text-muted">Property / Guest</th>
                    <th className="px-6 py-5 font-bold text-[11px] uppercase tracking-wider text-muted">Reserved At</th>
                    <th className="px-6 py-5 font-bold text-[11px] uppercase tracking-wider text-muted">Trip Dates</th>
                    <th className="px-6 py-5 font-bold text-[11px] uppercase tracking-wider text-muted">Financials</th>
                    <th className="px-6 py-5 font-bold text-[11px] uppercase tracking-wider text-muted text-right pr-12">Status</th>
                    <th className="px-6 py-5 font-bold text-[11px] uppercase tracking-wider text-muted text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy/5">
                  {filteredBookings.map((booking) => {
                    const desktopSt = getStatusConfig(booking);
                    const safeStatus = booking.status;
                    const minutesAgo = Math.floor((new Date().getTime() - new Date(booking.created_at).getTime()) / 60000);
                    const isLongPending = safeStatus === 'pending' && minutesAgo > 120; // 2 Hour Window

                    const StatusIcon = desktopSt.icon;

                    return (
                      <tr key={booking.id} className={`hover:bg-slate-50/40 transition-colors group ${isLongPending ? "bg-primary/[0.02]" : ""}`}>
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="text-xs font-mono font-black text-navy/20 uppercase tracking-tighter">
                              {/* VERCEL FIX */}
                              {(booking as any).booking_reference || `TX-VST-${booking.id.toString().padStart(4, "0")}`}
                            </span>
                            {isLongPending && (
                              <div className="flex items-center gap-1.5 mt-1.5">
                                <Clock className="w-3.5 h-3.5 text-primary" />
                                <span className="text-[9px] font-black text-primary uppercase tracking-widest">
                                  Recovery Window
                                </span>
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            {booking.property?.images?.[0] ? (
                              <img src={booking.property.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover shadow-sm" />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-navy/5 flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-navy/20" />
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-navy text-sm">
                                {booking.guest_name && booking.guest_name !== 'Guest'
                                  ? booking.guest_name
                                  : booking.guest_email.split('@')[0]}
                              </p>
                              <p className="text-xs text-primary font-medium mt-0.5">{booking.property?.title || 'Unknown Property'}</p>
                              <div className="flex items-center gap-1 text-[10px] text-muted mt-1">
                                <Mail className="w-3 h-3" />
                                {booking.guest_email}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-navy">
                              {/* VERCEL FIX */}
                              {safeStatus === 'confirmed' && (booking as any).confirmed_at
                                ? format(new Date((booking as any).confirmed_at), "MMM dd, HH:mm")
                                : safeStatus === 'cancelled' && (booking as any).cancelled_at
                                  ? format(new Date((booking as any).cancelled_at), "MMM dd, HH:mm")
                                  : format(new Date(booking.created_at), "MMM dd, HH:mm")
                              }
                            </span>
                            <span className="text-[10px] text-muted font-black uppercase tracking-widest mt-1">
                              {safeStatus === 'confirmed' ? 'Confirmed At' : safeStatus === 'cancelled' ? 'Cancelled At' : 'Reserved At'}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-bold text-navy bg-navy/5 px-2 py-0.5 rounded w-fit">
                              {format(parseISO(booking.check_in), "MMM d")} - {format(parseISO(booking.check_out), "MMM d")}
                            </span>
                            <span className="text-xs text-muted font-medium ml-1">
                              {booking.adults + booking.children} Guests
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="font-bold text-navy text-sm">${booking.total_price.toLocaleString()}</span>
                            <span className={`text-[10px] font-bold uppercase tracking-wide ${booking.payment_status === 'paid' ? 'text-emerald-600' :
                                booking.payment_status === 'failed' ? 'text-rose-600' :
                                  'text-amber-600'
                              }`}>
                              {booking.payment_status === 'paid' ? 'Paid' :
                                booking.payment_status === 'failed' ? 'Failed' :
                                  'Pending'}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-5 text-right pr-6">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest shadow-sm ${desktopSt.bg} ${desktopSt.text} ${desktopSt.border}`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {desktopSt.label}
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            {updatingId === booking.id ? (
                              <Loader2 className="w-4 h-4 text-primary animate-spin" />
                            ) : (
                              <div className="flex items-center gap-2">
                                {/* PENDING -> APPROVE or REJECT */}
                                {safeStatus === 'pending' && (
                                  <>
                                    <button onClick={() => handleStatusChange(booking.id, 'confirmed')} className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-lg transition-all" title="Approve">
                                      <CheckCircle2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleStatusChange(booking.id, 'cancelled')} className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white rounded-lg transition-all" title="Reject">
                                      <XCircle className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                                {/* CONFIRMED -> REJECT/CANCEL Only */}
                                {safeStatus === 'confirmed' && (
                                  <button onClick={() => handleStatusChange(booking.id, 'cancelled')} className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white rounded-lg transition-all" title="Cancel Booking">
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-navy/5">
              {filteredBookings.map((booking) => {
                const safeStatus = (booking.status ?? 'pending') as 'pending' | 'confirmed' | 'cancelled';
                const mobileSt = getStatusConfig(booking);
                const StatusIcon = mobileSt.icon;

                return (
                  <div key={booking.id} className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-navy/40 uppercase">
                        {/* VERCEL FIX */}
                        {(booking as any).booking_reference || `#VST-${booking.id.toString().padStart(4, '0')}`}
                      </span>
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${mobileSt.bg} ${mobileSt.text} ${mobileSt.border}`}>
                        <StatusIcon className="w-3 h-3" />
                        {mobileSt.label}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      {booking.property?.images?.[0] && (
                        <img src={booking.property.images[0]} alt="" className="w-16 h-16 rounded-xl object-cover shadow-sm" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-navy truncate">{booking.guest_name}</p>
                        <p className="text-xs text-primary font-medium truncate">{booking.property?.title}</p>
                        <p className="text-xs text-muted mt-1 leading-relaxed max-w-[150px] truncate">{booking.guest_email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-50 rounded-xl">
                        <p className="text-[10px] text-muted uppercase font-bold tracking-widest mb-1">Trip Dates</p>
                        <p className="text-xs font-bold text-navy">
                          {format(parseISO(booking.check_in), "MMM d")} - {format(parseISO(booking.check_out), "MMM d")}
                        </p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl">
                        <p className="text-[10px] text-muted uppercase font-bold tracking-widest mb-1">Amount</p>
                        <p className="text-xs font-bold text-navy">${booking.total_price.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="pt-2">
                      {updatingId === booking.id ? (
                        <div className="flex justify-center py-2">
                          <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {booking.status === 'pending' && (
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => handleStatusChange(booking.id, 'confirmed')}
                                className="flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white rounded-xl text-xs font-bold"
                              >
                                <CheckCircle2 className="w-4 h-4" /> Approve
                              </button>
                              <button
                                onClick={() => handleStatusChange(booking.id, 'cancelled')}
                                className="flex items-center justify-center gap-2 py-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-xs font-bold"
                              >
                                <XCircle className="w-4 h-4" /> Reject
                              </button>
                            </div>
                          )}
                          {booking.status === 'confirmed' && (
                            <button
                              onClick={() => handleStatusChange(booking.id, 'cancelled')}
                              className="flex items-center justify-center gap-2 py-3 bg-slate-50 text-rose-600 border border-navy/5 rounded-xl text-xs font-bold"
                            >
                              <XCircle className="w-4 h-4" /> Cancel Reservation
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

    </div>
  );
}