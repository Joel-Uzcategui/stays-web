import { ArrowRight, Search, Users } from "lucide-react";

import { addDays, today } from "@/lib/dates";

const field = "bg-transparent py-2 text-sm outline-none [color-scheme:light]";

export const HomeSearch = () => (
  <form
    action="/search"
    className="mt-5 flex flex-col gap-1 rounded border border-line p-1.5 lg:flex-row lg:items-center"
  >
    <label className="flex flex-1 items-center gap-2 px-2">
      <Search size={16} strokeWidth={1.5} className="shrink-0 text-muted" />
      <input
        name="q"
        type="search"
        aria-label="Destination"
        placeholder="City, hotel or address"
        className={`w-full ${field} placeholder:text-faint`}
      />
    </label>

    <label className="flex items-center gap-2 px-2 lg:border-l lg:border-line">
      <span className="text-sm text-faint">In</span>
      <input
        name="checkIn"
        type="date"
        min={today()}
        defaultValue={addDays(today(), 14)}
        aria-label="Check-in"
        className={field}
      />
    </label>

    <label className="flex items-center gap-2 px-2 lg:border-l lg:border-line">
      <span className="text-sm text-faint">Out</span>
      <input
        name="checkOut"
        type="date"
        min={today()}
        defaultValue={addDays(today(), 16)}
        aria-label="Check-out"
        className={field}
      />
    </label>

    <label className="flex items-center gap-2 px-2 lg:border-l lg:border-line">
      <Users size={16} strokeWidth={1.5} className="shrink-0 text-muted" />
      <input
        name="guests"
        type="number"
        min={1}
        max={10}
        defaultValue={2}
        aria-label="Guests"
        className={`w-12 ${field}`}
      />
    </label>

    <button
      type="submit"
      className="inline-flex items-center justify-center gap-1.5 rounded bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-deep"
    >
      Search
      <ArrowRight size={15} strokeWidth={2} />
    </button>
  </form>
);
