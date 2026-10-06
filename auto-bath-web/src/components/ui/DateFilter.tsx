"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";

export function DateFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPeriod = searchParams.get("period") || "all";

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPeriod = e.target.value;
    router.push(`/admin?period=${newPeriod}`);
  };

  return (
    <div className="flex items-center gap-2 bg-[#050505] border border-white/10 rounded-lg px-3 py-1.5 focus-within:border-electric-cyan transition-colors">
      <Filter size={14} className="text-white/30" />
      <select 
        value={currentPeriod} 
        onChange={handlePeriodChange}
        className="bg-transparent text-white text-xs font-bold uppercase tracking-widest outline-none cursor-pointer hover:text-electric-cyan transition-colors"
      >
        <option value="all" className="bg-[#050505] text-white">All Time</option>
        <option value="30days" className="bg-[#050505] text-white">Last 30 Days</option>
        <option value="90days" className="bg-[#050505] text-white">Last 90 Days</option>
        <option value="year" className="bg-[#050505] text-white">This Year</option>
      </select>
    </div>
  );
}
