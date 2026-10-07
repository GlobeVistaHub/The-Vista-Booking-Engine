"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, EyeOff, Phone, X, XCircle } from "lucide-react";
import {
  cancelBookingAction,
  updateBookingStatusAction,
  type ActionResult,
} from "@/app/actions/admin";
import {
  dateKeyOf,
  formatPrice,
  formatRangeLabel,
  formatTimeRange,
  parseDateKey,
  type CalendarBooking,
} from "@/lib/schedule";
import { StatusChip } from "./StatusChip";

interface BookingDrawerProps {
  booking: CalendarBooking;
  onClose: () => void;
}

type Notice = { tone: "error" | "warning"; text: string };

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[96px_1fr] gap-3 border-b border-white/5 py-3 last:border-b-0">
      <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">{label}</dt>
      <dd className="min-w-0 break-words text-sm text-white/85">{children}</dd>
    </div>
  );
}

function refundNote(booking: CalendarBooking): string {
  if (booking.status === "pending") return "Payment was never completed, so there is nothing to refund.";
  if (booking.refundEligible) {
    return `${formatPrice(booking.priceCents)} is refunded to the customer automatically (48h+ notice).`;
  }
  return "This is inside the 48-hour window, so no refund will be issued.";
}

export function BookingDrawer({ booking, onClose }: BookingDrawerProps) {
  const router = useRouter();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [isPending, startTransition] = useTransition();
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const dayLabel = formatRangeLabel("day", parseDateKey(dateKeyOf(booking.start)) ?? new Date(booking.start));
  const isOpen = booking.status === "confirmed" || booking.status === "pending";

  const runStatusUpdate = (status: "completed" | "no_show") => {
    setNotice(null);
    startTransition(async () => {
      const result: ActionResult = await updateBookingStatusAction(booking.id, status);
      if (result.success) {
        router.refresh();
        onClose();
      } else {
        setNotice({ tone: "error", text: result.error ?? "Something went wrong." });
      }
    });
  };

  const runCancel = () => {
    setNotice(null);
    startTransition(async () => {
      const result = await cancelBookingAction(booking.id);
      if (!result.success) {
        setNotice({ tone: "error", text: result.error ?? "Something went wrong." });
        return;
      }
      router.refresh();
      if (result.refund === "failed") {
        setConfirmingCancel(false);
        setNotice({
          tone: "warning",
          text: "Booking cancelled, but the automatic refund failed. Refund the customer manually in Stripe.",
        });
        return;
      }
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close booking details"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/70"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-drawer-title"
        className="sched-sheet absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col border-t-4 border-t-cyber-orange bg-[#0A0A0A] md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-[440px] md:border-l md:border-t-0 md:border-white/10"
      >
        <header className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div className="min-w-0">
            <StatusChip status={booking.status} />
            <h2
              id="booking-drawer-title"
              className="mt-3 break-words font-heading text-xl font-bold uppercase leading-tight tracking-wider text-white"
            >
              {booking.customerName}
            </h2>
            <p className="mt-2 font-mono text-xs uppercase tracking-wider text-white/50">
              {dayLabel} · {formatTimeRange(booking.start, booking.durationMinutes)}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 border border-white/10 p-2 text-white/60 transition-colors hover:border-white/40 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
          >
            <X size={16} />
          </button>
        </header>

        <dl className="flex-1 overflow-y-auto px-5">
          <Detail label="Service">{booking.service}</Detail>
          <Detail label="Vehicle">{booking.vehicle || "—"}</Detail>
          <Detail label="Value">
            <span className="font-mono">{formatPrice(booking.priceCents)}</span>
          </Detail>
          <Detail label="Phone">
            {booking.customerPhone ? (
              <a
                href={`tel:${booking.customerPhone}`}
                className="inline-flex items-center gap-2 text-electric-cyan underline-offset-4 hover:underline"
              >
                <Phone size={14} /> {booking.customerPhone}
              </a>
            ) : (
              "—"
            )}
          </Detail>
          <Detail label="Notes">{booking.notes || "—"}</Detail>
          <Detail label="Payment ref">
            <span className="font-mono text-xs text-white/50">{booking.paymentRef ?? "—"}</span>
          </Detail>
        </dl>

        <footer className="space-y-3 border-t border-white/10 p-5">
          {notice && (
            <p
              role="alert"
              className={`border-l-4 px-3 py-2 text-xs ${
                notice.tone === "error"
                  ? "border-l-red-500 bg-red-500/10 text-red-300"
                  : "border-l-cyber-orange bg-cyber-orange/10 text-cyber-orange"
              }`}
            >
              {notice.text}
            </p>
          )}

          {!isOpen && (
            <p className="text-xs text-white/40">This booking is closed. No further actions are available.</p>
          )}

          {isOpen && !confirmingCancel && (
            <>
              {booking.status === "confirmed" && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => runStatusUpdate("completed")}
                    className={`flex items-center justify-center gap-2 border px-3 py-3 text-xs font-bold uppercase tracking-widest transition-transform hover:-translate-y-px active:translate-y-0 disabled:opacity-50 ${
                      booking.hasEnded
                        ? "border-[#25D366] bg-[#25D366] text-black"
                        : "border-[#25D366]/50 text-[#25D366] hover:bg-[#25D366]/10"
                    }`}
                  >
                    <CheckCircle2 size={14} /> Completed
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => runStatusUpdate("no_show")}
                    className="flex items-center justify-center gap-2 border border-cyber-orange/50 px-3 py-3 text-xs font-bold uppercase tracking-widest text-cyber-orange transition-transform hover:-translate-y-px hover:bg-cyber-orange/10 active:translate-y-0 disabled:opacity-50"
                  >
                    <EyeOff size={14} /> No-show
                  </button>
                </div>
              )}
              <button
                type="button"
                disabled={isPending}
                onClick={() => setConfirmingCancel(true)}
                className="flex w-full items-center justify-center gap-2 border border-white/15 px-3 py-3 text-xs font-bold uppercase tracking-widest text-white/60 transition-colors hover:border-red-500/60 hover:text-red-400 disabled:opacity-50"
              >
                <XCircle size={14} /> Cancel booking
              </button>
            </>
          )}

          {isOpen && confirmingCancel && (
            <div className="space-y-3 border border-red-500/40 bg-red-500/[0.06] p-4">
              <p className="text-sm font-bold text-white">Cancel this booking?</p>
              <p className="text-xs leading-relaxed text-white/70">
                {refundNote(booking)} The customer is notified by email.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setConfirmingCancel(false)}
                  className="border border-white/20 px-3 py-3 text-xs font-bold uppercase tracking-widest text-white/70 transition-colors hover:text-white disabled:opacity-50"
                >
                  Keep it
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={runCancel}
                  className="border border-red-500 bg-red-500 px-3 py-3 text-xs font-bold uppercase tracking-widest text-white transition-transform hover:-translate-y-px active:translate-y-0 disabled:opacity-60"
                >
                  {isPending ? "Cancelling…" : "Yes, cancel"}
                </button>
              </div>
            </div>
          )}
        </footer>
      </aside>
    </div>
  );
}
