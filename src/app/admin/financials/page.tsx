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
  Wallet
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function FinancialsDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { lang } = useLanguage();

  useEffect(() => {
    fetchFinancials();
  }, []);

  const fetchFinancials = async () => {
    setIsLoading(true);
    const data = await getBookings();
    // Only analyze confirmed bookings for real revenue
    setBookings(data.filter(b => b.status === 'confirmed'));
    setIsLoading(false);
  };

  // Financial Calculations
  const totalRevenue = bookings.reduce((sum, b) => sum + b.total_price, 0);
  const platformFees = totalRevenue * 0.10; // 10% Vista Platform Fee
  const hostPayout = totalRevenue - platformFees;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-20">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading text-navy font-bold flex items-center gap-3">
            <Wallet className="w-8 h-8 text-primary" />
            Financial Analytics
          </h1>
          <p className="text-muted mt-2">Track your luxury portfolio revenue, platform fees, and transaction history.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-navy/10 text-navy rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm">
          <Download className="w-5 h-5" />
          Export Ledger
        </button>
      </div>

      {isLoading ? (
        <div className="py-32 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted font-medium text-sm animate-pulse">Calculating financials...</p>
        </div>
      ) : (
        <>
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Metric 1 */}
            <div className="bg-white p-6 rounded-3xl border border-navy/5 shadow-soft relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
                <TrendingUp className="w-24 h-24 text-primary -mr-8 -mt-8" />
              </div>
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <DollarSign className="w-6 h-6" />
                </div>
                <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                  +14.5% <ArrowUpRight className="w-3 h-3 ml-1" />
                </span>
              </div>
              <h3 className="text-3xl font-heading font-bold text-navy mb-1">${totalRevenue.toLocaleString()}</h3>
              <p className="text-sm font-medium text-muted">Total Gross Volume</p>
            </div>

            {/* Metric 2 */}
            <div className="bg-white p-6 rounded-3xl border border-navy/5 shadow-soft relative overflow-hidden group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <CreditCard className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-3xl font-heading font-bold text-navy mb-1">${platformFees.toLocaleString()}</h3>
              <p className="text-sm font-medium text-muted">Platform Fees (10%)</p>
            </div>

            {/* Metric 3 */}
            <div className="bg-navy p-6 rounded-3xl border border-navy shadow-lg relative overflow-hidden group text-white">
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white backdrop-blur-sm">
                  <Wallet className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-3xl font-heading font-bold text-white mb-1 relative z-10">${hostPayout.toLocaleString()}</h3>
              <p className="text-sm font-medium text-white/70 relative z-10">Net Host Payout</p>
              
              {/* Premium Glow Effect */}
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/30 rounded-full blur-3xl" />
            </div>
          </div>

          {/* Transaction Ledger */}
          <div className="bg-white rounded-2xl shadow-soft border border-navy/5 overflow-hidden">
            <div className="p-6 border-b border-navy/5">
              <h2 className="text-xl font-bold text-navy">Confirmed Transactions Ledger</h2>
            </div>
            
            {bookings.length === 0 ? (
               <div className="py-12 text-center px-4">
                <p className="text-muted font-medium">No confirmed transactions found yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
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
                    {bookings.map((booking) => {
                      const net = booking.total_price * 0.9;
                      return (
                        <tr key={booking.id} className="hover:bg-slate-50/40 transition-colors group">
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-navy">
                              {format(parseISO(booking.created_at), "MMM dd, yyyy")}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-mono font-bold text-navy/40">
                              TX-VST-{booking.id.toString().padStart(4, '0')}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-navy text-sm">
                              {lang === 'ar' && booking.property ? booking.property.title_ar : booking.property?.title}
                            </p>
                            <p className="text-xs text-muted mt-0.5">{booking.guest_name}</p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="font-bold text-navy text-sm">${booking.total_price.toLocaleString()}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="font-bold text-emerald-600 text-sm bg-emerald-50 px-2 py-1 rounded-md">
                              + ${net.toLocaleString()}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
