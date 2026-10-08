# Auto-Bath OS — Roadmap

Status of the six sequential build steps. Update after each step ships.

| # | Step | Status |
|---|------|--------|
| 1 | Sentry injection & debug simulator | ✅ Shipped. Production build green; verify events via `/admin/simulator` |
| 2 | Admin schedule / calendar | ✅ Shipped. Calendar board is live and authenticated. |
| 3 | Customer ghost profile (view + cancel own bookings) | ✅ Shipped. Magic Link + 48h Cancel Logic |
| 4 | CMS manager (content + assets) | ✅ Shipped. Full content + Supabase public-assets bucket |
| 5 | SEO, tracking & Detailing Insights blog | ✅ Shipped. Dynamic OpenGraph, JSON-LD Schema, and FB/GA4 Tracking. |
| 6 | Text AI chatbot (voice-ready) | ⏳ Next |

---

## Step 2 — Admin schedule / calendar

**Route:** `/admin/calendar?view=day|week|month&date=YYYY-MM-DD` (URL is the state, every view is a shareable link).

### Decisions
- Week view is the default, with Day and Month toggles.
- Owner uses it on phone *and* desktop, so the layout is responsive:
  - Desktop: time grid (week/day) with overlap lanes and a live Melbourne "now" line.
  - Phone: agenda run sheet grouped by day; month view collapses to status markers.
- Actions per booking: view details, **mark completed**, **mark no-show**, **cancel with refund** (explicit refund preview before confirming).
- Cancelled bookings are hidden by default (toggle to show) so freed slots read as free.

### Files
| Area | File |
|------|------|
| Pure logic (+ tests) | `src/lib/schedule.ts`, `src/lib/schedule.test.ts` |
| Route | `src/app/admin/calendar/page.tsx` |
| UI | `src/components/admin/schedule/*` (`ScheduleBoard`, `TimeGrid`, `AgendaList`, `MonthGrid`, `BookingDrawer`, `ScheduleToolbar`, `StatusChip`, `statusMeta`, `useBusinessNow`) |
| Shell | `src/app/admin/layout.tsx`, `src/components/admin/AdminNav.tsx` (responsive + active link) |
| Server actions | `src/app/actions/admin.ts` (`cancelBookingAction`, `updateBookingStatusAction`, `purgeTestDataAction`) |
| Auth guard | `src/utils/admin-auth.ts` (`requireAdmin`, `getAdminUser`) |
| DB | `supabase/migrations/20261007_admin_calendar.sql` |

### Things to know
- **`bookings.scheduled_time` stores Melbourne wall-clock time labelled as UTC** (see `createBookingAction`). The calendar reads it with UTC getters on purpose. Real-time maths (refund window, "has ended") goes through `wallClockToInstant()`.
- **Refund window fix:** the old check compared the wall-clock value against real "now", skewing the 48h boundary by 10–11 hours. It now uses the shared, tested `refundEligibility()`.
- Refunds are only attempted for `confirmed` (paid) bookings. Cancelling an unpaid `pending` booking no longer fires a doomed Stripe call.
- **Admin role guard:** middleware only checks that *a* session exists. Privileged actions and the calendar page now also require `profiles.role = 'admin'`. This matters before step 3 gives customers logins.
- Completed bookings count towards revenue on the CRM dashboard.

### Deploy checklist
1. Run `supabase/migrations/20261007_admin_calendar.sql` in the Supabase SQL editor (adds `no_show`, an index, and the admin role for the owner accounts).
2. Push → Vercel build.
3. Sign in, open **Schedule**, confirm bookings render; try complete / no-show / cancel on a test booking.

### Tests
`node --test src/lib/schedule.test.ts`
