import { TrendingUp, Plus } from "lucide-react";
import SystemControlToggle from "@/components/SystemControlToggle";

export default function AdminPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading text-navy font-bold">Welcome back, Concierge.</h1>
          <p className="text-muted mt-2">Here is what is happening with your properties today.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-medium shadow-soft hover:shadow-hover hover:-translate-y-0.5 transition-all">
          <Plus className="w-5 h-5" />
          Add New Property
        </button>
      </div>

      {/* 2. System Control Toggle (Live vs Demo Mode) */}
      <SystemControlToggle />

      {/* 3. The KPI Metrics (Top Row) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-soft">
          <p className="text-sm font-medium text-muted mb-2">Total Revenue</p>
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-bold text-navy">$24,500</h3>
            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              12%
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-soft">
          <p className="text-sm font-medium text-muted mb-2">Active Bookings</p>
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-bold text-navy">12</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-soft relative overflow-hidden">
          <div className="absolute top-6 right-6 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <p className="text-sm font-medium text-muted mb-2">Pending Approvals</p>
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-bold text-navy">3</h3>
          </div>
        </div>
      </div>

      {/* 4. The Recent Bookings Table (Bottom Section) */}
      <div className="bg-white rounded-xl shadow-soft overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-navy">Recent Activity</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-muted border-b border-slate-100">
                <th className="px-6 py-4 font-medium text-sm">Guest Name</th>
                <th className="px-6 py-4 font-medium text-sm">Property</th>
                <th className="px-6 py-4 font-medium text-sm">Dates</th>
                <th className="px-6 py-4 font-medium text-sm">Status</th>
                <th className="px-6 py-4 font-medium text-sm">Total</th>
              </tr>
            </thead>
            <tbody className="text-navy divide-y divide-slate-100">
              {/* Row 1 */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-medium">Mohammed Al Fayed</td>
                <td className="px-6 py-4">Villa Azure (El Gouna)</td>
                <td className="px-6 py-4 text-muted text-sm">Oct 12 - Oct 18</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    Confirmed
                  </span>
                </td>
                <td className="px-6 py-4 font-medium">$4,200</td>
              </tr>
              {/* Row 2 */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-medium">Sarah Jenkins</td>
                <td className="px-6 py-4">Sunset Penthouse (Soma Bay)</td>
                <td className="px-6 py-4 text-muted text-sm">Oct 20 - Oct 25</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    Pending
                  </span>
                </td>
                <td className="px-6 py-4 font-medium">$1,850</td>
              </tr>
              {/* Row 3 */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-medium">Ahmed Hassan</td>
                <td className="px-6 py-4">Red Sea Estate (Sahl Hasheesh)</td>
                <td className="px-6 py-4 text-muted text-sm">Nov 01 - Nov 10</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    Confirmed
                  </span>
                </td>
                <td className="px-6 py-4 font-medium">$12,500</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
