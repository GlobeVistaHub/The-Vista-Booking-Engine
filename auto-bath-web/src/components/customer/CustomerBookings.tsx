"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/schedule";
import { customerCancelBookingAction } from "@/app/actions/customer";
import Link from "next/link";

interface BookingItem {
  id: string;
  status: string;
  scheduledTime: string;
  vehicle: string;
  serviceName: string;
  priceCents: number;
  refundEligible: boolean;
}

export default function CustomerBookings({ bookings }: { bookings: BookingItem[] }) {
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<BookingItem | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleCancel = async () => {
    if (!confirmModal) return;
    
    setCancellingId(confirmModal.id);
    setErrorMsg("");
    
    const res = await customerCancelBookingAction(confirmModal.id);
    
    if (res.success) {
      setConfirmModal(null);
    } else {
      setErrorMsg(res.error || "Failed to cancel booking.");
    }
    
    setCancellingId(null);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending': return <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-yellow-200">Awaiting Payment</span>;
      case 'confirmed': return <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-green-200">Confirmed</span>;
      case 'completed': return <span className="bg-neutral-100 text-neutral-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-neutral-200">Completed</span>;
      case 'cancelled': return <span className="bg-red-50 text-red-700 text-xs font-semibold px-2.5 py-0.5 rounded border border-red-100">Cancelled</span>;
      case 'no_show': return <span className="bg-orange-50 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-orange-200">No Show</span>;
      default: return null;
    }
  };

  if (!bookings || bookings.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-12 text-center">
        <svg className="w-16 h-16 text-neutral-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="text-xl font-semibold text-neutral-900 mb-2">No upcoming appointments</h3>
        <p className="text-neutral-500 mb-6">Looks like you don't have any bookings yet.</p>
        <Link href="/" className="inline-flex items-center justify-center px-6 py-3 bg-neutral-900 text-white font-medium rounded-lg hover:bg-neutral-800 transition-colors">
          Book a Wash
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {bookings.map((booking) => {
          const dateObj = new Date(booking.scheduledTime);
          const formattedDate = dateObj.toLocaleDateString('en-AU', { timeZone: 'UTC', weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
          const formattedTime = dateObj.toLocaleTimeString('en-AU', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit' });
          
          const isUpcoming = booking.status === 'pending' || booking.status === 'confirmed';
          const isPast = !isUpcoming;

          return (
            <div key={booking.id} className={`bg-white rounded-2xl border transition-all ${isPast ? 'border-neutral-100 opacity-75' : 'border-neutral-200 shadow-sm hover:shadow-md'}`}>
              <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    {getStatusBadge(booking.status)}
                    <span className="text-sm text-neutral-500 font-medium">Ref: {booking.id.split('-')[0].toUpperCase()}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-1">{formattedDate}</h3>
                  <p className="text-lg text-neutral-600 font-medium mb-4">{formattedTime}</p>
                  
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    <div className="flex items-center gap-2 text-neutral-700">
                      <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {booking.serviceName}
                    </div>
                    <div className="flex items-center gap-2 text-neutral-700">
                      <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      {booking.vehicle}
                    </div>
                    <div className="flex items-center gap-2 font-medium text-neutral-900">
                      {formatPrice(booking.priceCents)}
                    </div>
                  </div>
                </div>

                {isUpcoming && (
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => setConfirmModal(booking)}
                      className="w-full sm:w-auto px-6 py-3 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 font-medium rounded-lg transition-colors"
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cancellation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-8 relative animate-in fade-in zoom-in-95 duration-200">
            
            <div className="mb-6">
              {confirmModal.refundEligible ? (
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              )}
              
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">Cancel Appointment?</h3>
              
              {confirmModal.refundEligible ? (
                <p className="text-neutral-600">
                  Are you sure you want to cancel this booking? Because you are cancelling more than 48 hours in advance, you will receive a <strong className="text-neutral-900">full refund</strong>.
                </p>
              ) : (
                <div className="bg-red-50 text-red-800 p-4 rounded-lg border border-red-100 mt-4 text-sm font-medium">
                  <strong>Warning:</strong> You are cancelling within 48 hours of your appointment. According to our policy, this payment is non-refundable.
                </div>
              )}
            </div>

            {errorMsg && (
              <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-100">
                {errorMsg}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setConfirmModal(null)}
                disabled={cancellingId !== null}
                className="flex-1 px-4 py-3 border border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50"
              >
                Keep Appointment
              </button>
              <button
                onClick={handleCancel}
                disabled={cancellingId !== null}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center disabled:opacity-70"
              >
                {cancellingId === confirmModal.id ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
