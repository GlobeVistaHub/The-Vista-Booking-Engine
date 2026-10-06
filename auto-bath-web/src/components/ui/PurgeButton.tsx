"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { purgeTestDataAction } from "@/app/actions/admin";

export function PurgeButton() {
  const [isPurging, setIsPurging] = useState(false);

  const handlePurge = async () => {
    if (!confirm("Are you sure you want to delete ALL bookings? This cannot be undone and will reset your dashboard earnings to $0.")) return;
    
    setIsPurging(true);
    await purgeTestDataAction();
    setIsPurging(false);
  };

  return (
    <button 
      onClick={handlePurge}
      disabled={isPurging}
      className="flex items-center gap-2 px-4 py-2 bg-[#df1b41]/10 text-[#df1b41] hover:bg-[#df1b41]/20 border border-[#df1b41]/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
    >
      <Trash2 size={14} />
      {isPurging ? "Purging..." : "Purge Test Data"}
    </button>
  );
}
