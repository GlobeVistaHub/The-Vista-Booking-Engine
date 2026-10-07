"use client";

import { useSyncExternalStore } from "react";
import { businessNow, type BusinessNow } from "@/lib/schedule";

let cached: { minute: number; value: BusinessNow } | null = null;

function subscribe(onChange: () => void) {
  const timer = setInterval(onChange, 30_000);
  return () => clearInterval(timer);
}

function getSnapshot(): BusinessNow | null {
  const minute = Math.floor(Date.now() / 60_000);
  if (!cached || cached.minute !== minute) {
    cached = { minute, value: businessNow(minute * 60_000) };
  }
  return cached.value;
}

const getServerSnapshot = (): BusinessNow | null => null;

/** Current Melbourne date/minute; null during SSR so hydration stays consistent. */
export function useBusinessNow(): BusinessNow | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
