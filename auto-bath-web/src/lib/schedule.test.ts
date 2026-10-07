import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  businessNow,
  formatClock,
  formatRangeLabel,
  getRange,
  gridBounds,
  layoutDay,
  parseDateKey,
  refundEligibility,
  shiftAnchor,
  toDateKey,
  wallClockToInstant,
} from "./schedule.ts";

const key = (value: string) => parseDateKey(value)!;

describe("date keys", () => {
  it("round-trips valid keys and rejects invalid ones", () => {
    assert.equal(toDateKey(key("2026-10-07")), "2026-10-07");
    assert.equal(parseDateKey("2026-02-30"), null);
    assert.equal(parseDateKey("nonsense"), null);
    assert.equal(parseDateKey(undefined), null);
  });
});

describe("getRange", () => {
  it("week starts on Monday", () => {
    const range = getRange("week", key("2026-10-07")); // Wednesday
    assert.equal(toDateKey(range.start), "2026-10-05");
    assert.equal(range.days.length, 7);
    assert.equal(toDateKey(range.endExclusive), "2026-10-12");
  });

  it("month grid covers whole weeks around the month", () => {
    const range = getRange("month", key("2026-10-15"));
    assert.equal(toDateKey(range.start), "2026-09-28");
    assert.equal(range.days.length % 7, 0);
    assert.ok(range.days.some((day) => toDateKey(day) === "2026-10-31"));
  });

  it("day range is a single day", () => {
    assert.equal(getRange("day", key("2026-10-07")).days.length, 1);
  });
});

describe("shiftAnchor", () => {
  it("moves by the view's unit", () => {
    assert.equal(toDateKey(shiftAnchor("day", key("2026-10-07"), 1)), "2026-10-08");
    assert.equal(toDateKey(shiftAnchor("week", key("2026-10-07"), -1)), "2026-09-30");
    assert.equal(toDateKey(shiftAnchor("month", key("2026-12-20"), 1)), "2027-01-01");
  });
});

describe("formatRangeLabel", () => {
  it("handles weeks spanning two months", () => {
    assert.equal(formatRangeLabel("week", key("2026-10-01")), "28 Sep – 4 Oct 2026");
  });
});

describe("formatClock", () => {
  it("formats 12-hour times", () => {
    assert.equal(formatClock(0), "12:00 AM");
    assert.equal(formatClock(9 * 60 + 30), "9:30 AM");
    assert.equal(formatClock(12 * 60), "12:00 PM");
    assert.equal(formatClock(16 * 60), "4:00 PM");
  });
});

describe("wallClockToInstant", () => {
  it("applies Melbourne daylight time (UTC+11) in summer", () => {
    assert.equal(wallClockToInstant("2026-01-15T13:00:00.000Z").toISOString(), "2026-01-15T02:00:00.000Z");
  });

  it("applies Melbourne standard time (UTC+10) in winter", () => {
    assert.equal(wallClockToInstant("2026-07-15T13:00:00.000Z").toISOString(), "2026-07-15T03:00:00.000Z");
  });
});

describe("businessNow", () => {
  it("reports the Melbourne date and minute", () => {
    const now = businessNow(Date.parse("2026-01-15T14:30:00.000Z")); // 01:30 next day in Melbourne
    assert.deepEqual(now, { dateKey: "2026-01-16", minutes: 90 });
  });
});

describe("refundEligibility", () => {
  const now = Date.parse("2026-01-10T00:00:00.000Z");

  it("is eligible when the appointment is 48h+ away in real time", () => {
    // 2026-01-13 09:00 Melbourne = 2026-01-12T22:00Z → 94h away
    assert.equal(refundEligibility("2026-01-13T09:00:00.000Z", now).eligible, true);
  });

  it("is not eligible inside the window, accounting for the timezone offset", () => {
    // 2026-01-12 09:00 Melbourne = 2026-01-11T22:00Z → 46h away (naive UTC maths would say 57h)
    const result = refundEligibility("2026-01-12T09:00:00.000Z", now);
    assert.equal(result.eligible, false);
    assert.equal(Math.round(result.hoursUntil), 46);
  });
});

describe("layoutDay", () => {
  const booking = (start: string, durationMinutes: number) => ({ start, durationMinutes });

  it("puts non-overlapping bookings in a single lane", () => {
    const laid = layoutDay([
      booking("2026-10-07T09:00:00.000Z", 60),
      booking("2026-10-07T11:00:00.000Z", 60),
    ]);
    assert.deepEqual(laid.map((entry) => [entry.lane, entry.lanes]), [[0, 1], [0, 1]]);
  });

  it("splits overlapping bookings into side-by-side lanes", () => {
    const laid = layoutDay([
      booking("2026-10-07T09:00:00.000Z", 180),
      booking("2026-10-07T09:30:00.000Z", 60),
    ]);
    assert.deepEqual(laid.map((entry) => [entry.lane, entry.lanes]), [[0, 2], [1, 2]]);
  });
});

describe("gridBounds", () => {
  it("defaults to 8–18 and widens to fit late bookings", () => {
    assert.deepEqual(gridBounds([]), { startHour: 8, endHour: 18 });
    assert.deepEqual(gridBounds([{ start: "2026-10-07T16:00:00.000Z", durationMinutes: 360 }]), {
      startHour: 8,
      endHour: 22,
    });
  });
});
