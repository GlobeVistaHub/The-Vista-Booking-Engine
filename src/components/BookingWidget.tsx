"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Search, MapPin, Calendar as CalendarIcon, Users, Plus, Minus } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { PROPERTIES } from "@/data/properties";

// Derive unique locations dynamically from the data — zero hardcoding
const UNIQUE_LOCATIONS = Array.from(new Set(PROPERTIES.map(p => p.location))).sort();

export default function BookingWidget() {
  const router = useRouter();
  const { t, lang } = useLanguage();

  const [activeTab, setActiveTab] = useState<"location" | "dates" | "guests" | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to?: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Get the translated display label for a raw location string
  const getLocationDisplay = (loc: string) => {
    const property = PROPERTIES.find(p => p.location === loc);
    return lang === "ar" && property ? property.location_ar : loc;
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedLocation) params.set("location", selectedLocation);
    if (dateRange.from) params.set("from", format(dateRange.from, "yyyy-MM-dd"));
    if (dateRange.to) params.set("to", format(dateRange.to, "yyyy-MM-dd"));
    params.set("adults", adults.toString());
    params.set("children", children.toString());
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto z-40">
      {/* BACKGROUND OVERLAY WHEN WIDGET IS OPEN */}
      {activeTab && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => setActiveTab(null)}
        />
      )}

      {/* MAIN PILL CONTAINER */}
      <div
        className="bg-surface w-full rounded-2xl md:rounded-full p-2 md:p-3 flex flex-col md:flex-row items-center gap-2 md:gap-0 relative z-10 transition-all duration-300"
        style={{ boxShadow: activeTab ? "var(--shadow-hover)" : "var(--shadow-soft)" }}
      >

        {/* LOCATION INPUT */}
        <div
          onClick={() => setActiveTab(activeTab === "location" ? null : "location")}
          className={`flex-1 flex items-center gap-3 px-6 py-4 md:py-2 w-full rounded-full transition-colors cursor-pointer group ${activeTab === "location" ? "bg-navy/5 shadow-inner" : "hover:bg-navy/5"}`}
        >
          <MapPin className={`w-5 h-5 flex-shrink-0 transition-colors ${activeTab === "location" ? "text-primary" : "text-primary/70"}`} />
          <div className="flex flex-col text-start">
            <span className="text-xs font-bold uppercase tracking-widest text-navy">{t("location")}</span>
            <span className={`text-sm font-medium transition-colors ${selectedLocation ? "text-navy" : "text-muted"}`}>
              {selectedLocation ? getLocationDisplay(selectedLocation) : t("locationPlaceholder")}
            </span>
          </div>
        </div>

        {/* DATES INPUT */}
        <div
          onClick={() => setActiveTab(activeTab === "dates" ? null : "dates")}
          className={`flex-1 flex items-center gap-3 px-6 py-4 md:py-2 w-full rounded-full transition-colors cursor-pointer group ${activeTab === "dates" ? "bg-navy/5 shadow-inner" : "hover:bg-navy/5"}`}
        >
          <CalendarIcon className={`w-5 h-5 flex-shrink-0 transition-colors ${activeTab === "dates" ? "text-primary" : "text-primary/70"}`} />
          <div className="flex flex-col text-start">
            <span className="text-xs font-bold uppercase tracking-widest text-navy">{t("dates")}</span>
            <span className={`text-sm font-medium transition-colors ${dateRange.from ? "text-navy" : "text-muted"}`}>
              {dateRange.from
                ? dateRange.to
                  ? `${format(dateRange.from, "MMM d")} – ${format(dateRange.to, "MMM d")}`
                  : format(dateRange.from, "MMM d")
                : t("addDates")}
            </span>
          </div>
        </div>

        {/* GUESTS INPUT */}
        <div
          onClick={() => setActiveTab(activeTab === "guests" ? null : "guests")}
          className={`flex-1 flex items-center gap-3 px-6 py-4 md:py-2 w-full rounded-full transition-colors cursor-pointer group ${activeTab === "guests" ? "bg-navy/5 shadow-inner" : "hover:bg-navy/5"}`}
        >
          <Users className={`w-5 h-5 flex-shrink-0 transition-colors ${activeTab === "guests" ? "text-primary" : "text-primary/70"}`} />
          <div className="flex flex-col text-start">
            <span className="text-xs font-bold uppercase tracking-widest text-navy">{t("guests")}</span>
            <span className="text-sm font-medium text-navy transition-colors">
              {adults + children > 0 ? `${adults + children} ${t("guests")}` : t("addGuests")}
            </span>
          </div>
        </div>

        {/* SEARCH BUTTON — now calls handleSearch instead of <Link> */}
        <button
          onClick={handleSearch}
          className="w-full md:w-auto mt-2 md:mt-0 ms-0 md:ms-2 flex items-center justify-center gap-2 bg-primary hover:brightness-110 text-white px-8 py-5 md:py-4 rounded-full font-bold text-sm transition-all shadow-md"
        >
          <Search className="w-4 h-4" />
          <span>{t("search")}</span>
        </button>
      </div>

      {/* POPUP SHEETS */}
      {activeTab === "location" && (
        <div
          className={`absolute top-[110%] ${lang === "ar" ? "right-0 md:right-4" : "left-0 md:left-4"} w-full md:w-[350px] bg-surface rounded-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-200 z-50 border border-navy/5`}
          style={{ boxShadow: "var(--shadow-hover)" }}
        >
          <h4 className="text-xs font-bold uppercase tracking-widest text-muted mb-4 px-2">{t("popularRegions")}</h4>
          <ul className="space-y-1">
            {UNIQUE_LOCATIONS.map(loc => (
              <li
                key={loc}
                onClick={() => {
                  setSelectedLocation(loc);
                  setActiveTab("dates");
                }}
                className={`px-4 py-3 rounded-xl cursor-pointer flex items-center gap-3 transition-colors ${
                  selectedLocation === loc ? "bg-primary/10 text-primary font-bold" : "hover:bg-navy/5 text-navy font-medium"
                }`}
              >
                <MapPin className="w-4 h-4 opacity-50 shrink-0" />
                <span>{getLocationDisplay(loc)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === "dates" && (
        <div
          className="absolute top-[110%] left-0 md:left-1/4 w-[100%] md:w-auto bg-surface rounded-2xl p-6 z-50 flex flex-col items-center border border-navy/5"
          style={{ boxShadow: "var(--shadow-hover)" }}
        >
          <DayPicker
            mode="range"
            selected={{ from: dateRange.from, to: dateRange.to }}
            onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
            numberOfMonths={1}
            className="font-body"
            dir={lang === "ar" ? "rtl" : "ltr"}
            classNames={{
              day_selected: "bg-primary text-white hover:bg-primary font-bold",
              day_today: "font-bold text-navy",
            }}
          />
          <div className="w-full flex justify-end mt-4 pt-4 border-t border-navy/5">
            <button
              onClick={() => setActiveTab("guests")}
              className="text-primary text-sm font-bold border-b border-primary pb-0.5 hover:brightness-110"
            >
              {t("skipToGuests")}
            </button>
          </div>
        </div>
      )}

      {activeTab === "guests" && (
        <div
          className={`absolute top-[110%] ${lang === "ar" ? "left-0 md:left-1/4" : "right-0 md:right-1/4"} w-full md:w-[350px] bg-surface rounded-2xl p-6 z-50 border border-navy/5`}
          style={{ boxShadow: "var(--shadow-hover)" }}
        >
          {/* ADULTS */}
          <div className="flex items-center justify-between py-4 border-b border-navy/5">
            <div>
              <h4 className="font-bold text-navy">{t("adults")}</h4>
              <p className="text-xs text-muted">{t("adultsAge")}</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setAdults(Math.max(1, adults - 1))}
                className="w-8 h-8 rounded-full border border-navy/20 flex items-center justify-center text-navy hover:border-navy transition-colors disabled:opacity-30"
                disabled={adults <= 1}
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-4 text-center font-medium text-navy">{adults}</span>
              <button
                onClick={() => setAdults(adults + 1)}
                className="w-8 h-8 rounded-full border border-navy/20 flex items-center justify-center text-navy hover:border-navy transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* CHILDREN */}
          <div className="flex items-center justify-between py-4">
            <div>
              <h4 className="font-bold text-navy">{t("children")}</h4>
              <p className="text-xs text-muted">{t("childrenAge")}</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setChildren(Math.max(0, children - 1))}
                className="w-8 h-8 rounded-full border border-navy/20 flex items-center justify-center text-navy hover:border-navy transition-colors disabled:opacity-30"
                disabled={children <= 0}
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-4 text-center font-medium text-navy">{children}</span>
              <button
                onClick={() => setChildren(children + 1)}
                className="w-8 h-8 rounded-full border border-navy/20 flex items-center justify-center text-navy hover:border-navy transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* DONE button auto-triggers search */}
          <button
            onClick={handleSearch}
            className="w-full mt-4 py-3 bg-primary text-white rounded-full font-bold text-sm hover:brightness-110 transition-all"
          >
            {t("search")}
          </button>
        </div>
      )}
    </div>
  );
}
