"use client";
import { Trash2 } from "lucide-react";
import { cancelBookingAction } from "@/app/actions/admin";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function CancelButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <button 
      onClick={async () => {
        setLoading(true);
        const result = await cancelBookingAction(id);
        if (!result.success) {
          alert(result.error ?? "Failed to cancel booking. Please try again.");
          setLoading(false);
          return;
        }
        if (result.refund === "failed") {
          alert("Booking cancelled, but the automatic refund failed. Please refund the customer manually in Stripe.");
        }
        router.refresh();
        setLoading(false);
      }}
      disabled={loading}
      className="flex items-center justify-end gap-2 ml-auto text-cyber-orange hover:text-red-500 transition-colors text-xs font-bold uppercase tracking-widest disabled:opacity-50"
    >
      <Trash2 size={14} /> {loading ? "Canceling..." : "Cancel"}
    </button>
  );
}
