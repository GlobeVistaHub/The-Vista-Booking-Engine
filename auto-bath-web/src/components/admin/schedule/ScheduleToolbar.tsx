import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  formatRangeLabel,
  SCHEDULE_VIEWS,
  shiftAnchor,
  toDateKey,
  type ScheduleView,
} from "@/lib/schedule";

interface ScheduleToolbarProps {
  view: ScheduleView;
  anchor: Date;
  todayKey: string;
}

const href = (view: ScheduleView, dateKey: string) => `/admin/calendar?view=${view}&date=${dateKey}`;

const navButton =
  "flex h-11 w-11 items-center justify-center border border-white/15 text-white/70 transition-colors hover:border-white/50 hover:text-white focus-visible:outline-2 focus-visible:outline-white";

/** URL-driven navigation: every state is a shareable link, no client JS needed. */
export function ScheduleToolbar({ view, anchor, todayKey }: ScheduleToolbarProps) {
  const previous = toDateKey(shiftAnchor(view, anchor, -1));
  const next = toDateKey(shiftAnchor(view, anchor, 1));
  const anchorKey = toDateKey(anchor);

  return (
    <header className="mb-6 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-cyber-orange">Dispatch board</p>
        <h1 className="font-heading text-xl font-bold uppercase leading-tight tracking-widest text-white sm:text-2xl lg:text-3xl">
          {formatRangeLabel(view, anchor)}
        </h1>
        <p className="mt-2 text-xs text-white/40">All times are Melbourne local time.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <nav aria-label="Change date range" className="flex items-center gap-2">
          <Link href={href(view, previous)} className={navButton} aria-label="Previous">
            <ChevronLeft size={18} />
          </Link>
          <Link
            href={href(view, todayKey)}
            className="flex h-11 items-center border border-white/15 px-4 text-xs font-bold uppercase tracking-widest text-white/70 transition-colors hover:border-cyber-orange hover:text-cyber-orange focus-visible:outline-2 focus-visible:outline-white"
          >
            Today
          </Link>
          <Link href={href(view, next)} className={navButton} aria-label="Next">
            <ChevronRight size={18} />
          </Link>
        </nav>

        <nav aria-label="Change view" className="flex border border-white/15">
          {SCHEDULE_VIEWS.map((option) => (
            <Link
              key={option}
              href={href(option, anchorKey)}
              aria-current={option === view ? "page" : undefined}
              className={`flex h-11 items-center px-4 text-xs font-bold uppercase tracking-widest transition-colors focus-visible:outline-2 focus-visible:outline-white ${
                option === view ? "bg-cyber-orange text-black" : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              {option}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
