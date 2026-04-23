"use client";

import { useEffect, useState } from "react";
import { getBookings, Booking } from "@/data/api";
import { format, parseISO } from "date-fns";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Download,
  Loader2,
  ArrowUpRight,
  Wallet,
  LayoutGrid,
  Store
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@clerk/nextjs";
import { useAppModeStore } from "@/store/appModeStore";
import { supabase } from "@/lib/supabase";

export default function FinancialsDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { lang } = useLanguage();
  const { getToken } = useAuth();
  const { isWhiteLabel, setWhiteLabel, brandName, isDemoMode } = useAppModeStore();

  useEffect(() => {
    fetchFinancials();

    // REAL-TIME INTELLIGENCE: Update revenue and ledger live
    const channel = supabase
      .channel('financials-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        () => {
          console.log("[Vista-Financials] Money move detected, updating ledger...");
          fetchFinancials();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isDemoMode]);

  const fetchFinancials = async () => {
    setIsLoading(true);
    const token = await getToken({ template: 'supabase' });
    const data = await getBookings(token || undefined);
    setBookings(data);
    setIsLoading(false);
  };

  // Financial Calculations
  const confirmedBookings = bookings.filter(b => b.status === "confirmed");
  const failedBookings = bookings.filter(b => b.payment_status === "failed");
  
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.total_price, 0);
  const potentialRevenue = failedBookings.reduce((sum, b) => sum + b.total_price, 0);
  
  // In platform mode, show 10% fee. In white-label, the owner keeps 100%.
  const platformFees = isWhiteLabel ? 0 : totalRevenue * 0.10;
  const hostPayout = totalRevenue - platformFees;

  const handleExportCSV = () => {
    const headers = ["Date", "Reference", "Property", "Guest", "Gross Amount", "Net Payout"];
    const rows = bookings.map(b => {
      const net = isWhiteLabel ? b.total_price : b.total_price * 0.9;
      return [
        format(parseISO(b.created_at), "MMM dd, yyyy"),
        `${b.booking_reference || 'TX-VST-' + b.id.toString().padStart(4, "0")}`,
        b.property?.title || `Property #${b.property_id}`,
        b.guest_name,
        `$${b.total_price}`,
        `$${net.toFixed(2)}`
      ].join(",");
    });
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vista-ledger-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-20">

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading text-navy font-bold flex items-center gap-3">
            <Wallet className="w-8 h-8 text-primary" />
            Financial Analytics
          </h1>
          <p className="text-muted mt-2">Track revenue, platform fees, and transaction history.</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-navy/10 text-navy rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm"
        >
          <Download className="w-5 h-5" />
          Export Ledger
        </button>
      </div>

      {/* ─── PLATFORM MODE TOGGLE ─────────────────────────────────── */}
      <div className="bg-white p-6 rounded-2xl shadow-soft border border-navy/5 relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-1.5 h-full transition-colors duration-500 ${isWhiteLabel ? "bg-primary" : "bg-emerald-500"}`} />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pl-4">
          <div>
            <h3 className="text-lg font-bold text-navy flex items-center gap-3">
              Operating Mode
              <span className={`text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full font-black shadow-sm ${isWhiteLabel
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                }`}>
                {isWhiteLabel ? "White Label SaaS" : "Platform Mode"}
              </span>
            </h3>
            <p className="text-muted text-sm mt-1.5 max-w-xl">
              {isWhiteLabel
                ? `You are operating as a white-label SaaS owner. The application is fully branded as "${brandName}" with no Vista platform fees. 100% of revenue is yours.`
                : "You are running as a shared marketplace platform. A 10% Vista platform fee applies to all transactions."}
            </p>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center bg-navy/[0.03] p-1.5 rounded-full w-full sm:w-auto h-14 relative border border-navy/5 shadow-inner flex-shrink-0">
            <div
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-4px)] bg-white rounded-full shadow-md transition-all duration-500 ease-out z-0 ${isWhiteLabel ? "translate-x-[calc(100%+2px)]" : "translate-x-[2px]"
                }`}
            />
            <button
              onClick={() => setWhiteLabel(false)}
              className={`flex-1 sm:w-40 flex justify-center items-center gap-2 text-sm font-bold z-10 transition-all duration-300 ${!isWhiteLabel ? "text-emerald-600 scale-105" : "text-navy/40 hover:text-navy"
                }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Platform
            </button>
            <button
              onClick={() => setWhiteLabel(true)}
              className={`flex-1 sm:w-40 flex justify-center items-center gap-2 text-sm font-bold z-10 transition-all duration-300 ${isWhiteLabel ? "text-primary scale-105" : "text-navy/40 hover:text-navy"
                }`}
            >
              <Store className="w-4 h-4" />
              White Label
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="py-32 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted font-medium text-sm animate-pulse">Calculating financials...</p>
        </div>
      ) : (
        <>
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            {/* Metric 1: Total Revenue */}
            <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-navy/5 shadow-soft relative overflow-hidden group col-span-2 md:col-span-1">
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity hidden md:block">
                <TrendingUp className="w-24 h-24 text-primary -mr-8 -mt-8" />
              </div>
              <div className="flex items-start justify-between mb-2 md:mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <DollarSign className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <span className="flex items-center text-[10px] md:text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                  +14% <ArrowUpRight className="w-3 h-3 ml-1" />
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-heading font-bold text-navy mb-1 line-clamp-1">${totalRevenue.toLocaleString()}</h3>
              <p className="text-[10px] md:text-sm font-medium text-muted uppercase tracking-wider">Gross Volume</p>
            </div>

            {/* Metric 2: Fees */}
            <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-navy/5 shadow-soft relative overflow-hidden group">
              <div className="flex items-start justify-between mb-2 md:mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <CreditCard className="w-5 h-5 md:w-6 md:h-6" />
                </div>
              </div>
              <h3 className="text-xl md:text-3xl font-heading font-bold text-navy mb-1">
                {platformFees === 0 ? "—" : `$${platformFees.toLocaleString()}`}
              </h3>
              <p className="text-[10px] md:text-sm font-medium text-muted uppercase tracking-wider">
                {isWhiteLabel ? "Fees Waived" : "Fees (10%)"}
              </p>
            </div>

            {/* Metric 3: Net Payout */}
            <div className="bg-navy p-4 md:p-6 rounded-2xl md:rounded-3xl border border-navy shadow-lg relative overflow-hidden group text-white">
              <div className="flex items-start justify-between mb-2 md:mb-4 relative z-10">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-white/10 flex items-center justify-center text-white backdrop-blur-sm">
                  <Wallet className="w-5 h-5 md:w-6 md:h-6" />
                </div>
              </div>
              <h3 className="text-xl md:text-3xl font-heading font-bold text-white mb-1 relative z-10">${hostPayout.toLocaleString()}</h3>
              <p className="text-[10px] md:text-sm font-medium text-white/50 uppercase tracking-wider relative z-10">
                {isWhiteLabel ? "Owners Net" : "Net Payout"}
              </p>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary/20 rounded-full blur-3xl" />
            </div>
          </div>

          {/* Lead Recovery Analytics */}
          {failedBookings.length > 0 && (
            <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-rose-500 shadow-sm">
                    <TrendingUp className="w-6 h-6 rotate-180" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-rose-600">Lost Opportunity</p>
                    <h4 className="text-2xl font-heading font-bold text-navy">${potentialRevenue.toLocaleString()}</h4>
                  </div>
               </div>
               <div className="text-center md:text-right">
                  <p className="text-sm text-navy/60 max-w-xs">
                    You have <span className="font-bold text-rose-600">{failedBookings.length} failed attempts</span>. Recovering just 20% of these could add <strong>${Math.round(potentialRevenue * 0.2).toLocaleString()}</strong> to your net payout.
                  </p>
               </div>
               <button onClick={() => window.location.href='/admin'} className="px-6 py-3 bg-navy text-white rounded-xl font-bold text-sm hover:brightness-110 transition-all">
                  Review Failed Leads
               </button>
            </div>
          )}

          {/* Transaction Ledger */}
          <div className="bg-white rounded-2xl shadow-soft border border-navy/5 overflow-hidden">
            <div className="p-4 md:p-6 border-b border-navy/5 flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-bold text-navy">Confirmed Ledger</h2>
              <span className="text-[10px] md:text-xs text-muted font-bold uppercase tracking-widest">{bookings.length} TXS</span>
            </div>

            {bookings.length === 0 ? (
              <div className="py-12 text-center px-4">
                <p className="text-muted font-medium">No confirmed transactions found yet.</p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 text-navy border-b border-navy/5">
                        <th className="px-6 py-4 font-bold text-[11px] uppercase tracking-wider text-muted">Date</th>
                        <th className="px-6 py-4 font-bold text-[11px] uppercase tracking-wider text-muted">Reference</th>
                        <th className="px-6 py-4 font-bold text-[11px] uppercase tracking-wider text-muted">Property</th>
                        <th className="px-6 py-4 font-bold text-[11px] uppercase tracking-wider text-muted text-right">Gross Amount</th>
                        <th className="px-6 py-4 font-bold text-[11px] uppercase tracking-wider text-muted text-right">Net Payout</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy/5">
                      {bookings.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((booking) => {
                        const net = isWhiteLabel ? booking.total_price : booking.total_price * 0.9;
                        const isFailed = booking.payment_status === 'failed';
                        return (
                          <tr key={booking.id} className={`hover:bg-slate-50/40 transition-colors group ${isFailed ? "opacity-60" : ""}`}>
                            <td className="px-6 py-4">
                              <span className="text-sm font-medium text-navy">
                                {format(parseISO(booking.created_at), "MMM dd, yyyy")}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-xs font-mono font-bold text-navy/40">
                                {isFailed ? "LEAD-" : ""}{booking.booking_reference || `TX-VST-${booking.id.toString().padStart(4, "0")}`}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <p className="font-bold text-navy text-sm">
                                  {lang === "ar" && booking.property ? booking.property.title_ar : booking.property?.title}
                                </p>
                                {isFailed && <span className="text-[8px] font-black uppercase px-1.5 py-0.5 bg-rose-50 text-rose-500 border border-rose-100 rounded">Lead</span>}
                              </div>
                              <p className="text-xs text-muted mt-0.5">{booking.guest_name}</p>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className={`font-bold text-sm ${isFailed ? "text-navy/30 line-through" : "text-navy"}`}>${booking.total_price.toLocaleString()}</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              {isFailed ? (
                                <span className="text-[10px] font-black text-rose-400 uppercase tracking-tighter italic">Interrupted</span>
                              ) : (
                                <span className="font-bold text-emerald-600 text-sm bg-emerald-50 px-2 py-1 rounded-md">
                                  + ${net.toLocaleString()}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile 'Receipt' View */}
                <div className="md:hidden divide-y divide-navy/5">
                  {bookings.map((booking) => {
                    const net = isWhiteLabel ? booking.total_price : booking.total_price * 0.9;
                    return (
                      <div key={booking.id} className="p-4 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold text-navy/30">
                            {booking.booking_reference || `TX-VST-${booking.id.toString().padStart(4, "0")}`}
                          </span>
                          <span className="text-[10px] font-bold text-muted uppercase">
                            {format(parseISO(booking.created_at), "MMM dd")}
                          </span>
                        </div>

                        <div className="flex justify-between items-start">
                          <div className="min-w-0 pr-4">
                            <p className="font-bold text-navy text-sm truncate">{booking.property?.title}</p>
                            <p className="text-xs text-muted truncate">{booking.guest_name}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-navy">${booking.total_price.toLocaleString()}</p>
                            <p className="text-[10px] font-black text-emerald-600 mt-1">
                              NET +${net.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
