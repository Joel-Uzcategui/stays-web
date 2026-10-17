import Link from "next/link";
import { ArrowRight, CalendarCheck, CreditCard, Lock } from "lucide-react";

import { getCountries, searchHotels } from "@/actions";
import { HotelCard } from "@/components";

import { HomeSearch } from "./ui/HomeSearch";

const regions = new Intl.DisplayNames(["en"], { type: "region" });

const countryName = (code: string) => {
  try {
    return regions.of(code) ?? code;
  } catch {
    return code;
  }
};

const flag = (code: string) =>
  /^[A-Za-z]{2}$/.test(code)
    ? String.fromCodePoint(
        ...[...code.toUpperCase()].map(
          (letter) => 0x1f1a5 + letter.charCodeAt(0),
        ),
      )
    : "";

const steps = [
  {
    icon: Lock,
    title: "The room is held for you",
    body: "Picking dates takes the rooms off the calendar straight away, so nobody can book them while you pay.",
  },
  {
    icon: CreditCard,
    title: "You pay with your card",
    body: "Card details go straight to Stripe and never touch our servers. Bank verification is supported.",
  },
  {
    icon: CalendarCheck,
    title: "Confirmation by email",
    body: "As soon as the payment clears, the booking is confirmed and the receipt lands in your inbox.",
  },
];

export default async function HomePage() {
  const [{ data: hotels, meta }, countries] = await Promise.all([
    searchHotels({ limit: 6 }),
    getCountries(),
  ]);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12">
      <p className="kicker text-accent">The catalog</p>
      <h1 className="mt-1 text-4xl">Hotels</h1>
      <p className="mt-2 text-sm text-muted">
        {meta.total} {meta.total === 1 ? "property" : "properties"} available
      </p>

      <HomeSearch />

      <Link
        href="/search"
        className="mt-3 inline-block text-sm text-accent underline underline-offset-2"
      >
        Filter by price, amenities or map
      </Link>

      {hotels.length === 0 ? (
        <p className="mt-9 text-muted">No hotels available yet.</p>
      ) : (
        <>
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>

          <Link
            href="/search"
            className="mt-5 inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
          >
            See all {meta.total} properties
            <ArrowRight size={15} strokeWidth={2} />
          </Link>
        </>
      )}

      {countries.length > 0 && (
        <section className="mt-14">
          <p className="kicker text-muted">Where we are</p>
          <h2 className="mt-1 font-heading text-2xl">Browse by country</h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {countries.map((code) => (
              <Link
                key={code}
                href={`/search?country=${code}`}
                className="rounded-full border border-line px-3 py-1.5 text-sm transition-colors hover:border-accent hover:text-accent"
              >
                {flag(code)} {countryName(code)}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-14 border-t border-line pt-10">
        <p className="kicker text-muted">How booking works</p>

        <div className="mt-5 grid gap-6 sm:grid-cols-3">
          {steps.map(({ icon: Icon, title, body }) => (
            <div key={title}>
              <Icon size={20} strokeWidth={1.5} className="text-accent" />
              <h3 className="mt-2 font-heading text-lg leading-tight">
                {title}
              </h3>
              <p className="mt-1 text-sm text-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
