"use client";
import { Trash2 } from "lucide-react";
import { cancelBookingAction } from "@/app/actions/admin";
import { useState } from "react";

export function CancelButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  return (
    <button 
      onClick={async () => {
        setLoading(true);
        const success = await cancelBookingAction(id);
        if (!success) {
          alert("Failed to cancel booking. Please try again.");
          setLoading(false);
        }
      }}
      disabled={loading}
      className="flex items-center justify-end gap-2 ml-auto text-cyber-orange hover:text-red-500 transition-colors text-xs font-bold uppercase tracking-widest disabled:opacity-50"
    >
      <Trash2 size={14} /> {loading ? "Canceling..." : "Cancel"}
    </button>
  );
}
