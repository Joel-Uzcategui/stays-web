import { Suspense } from "react";

import { getCountries, getPublicAmenities, searchHotels } from "@/actions";
import { HotelCard, Pagination } from "@/components";
import type { SearchQuery } from "@/interfaces";

import { SearchFilters } from "./ui/SearchFilters";

const number = (value?: string) =>
  value === undefined || value === "" ? undefined : Number(value);

interface Props {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;

  const query: SearchQuery = {
    q: params.q,
    country: params.country,
    cityId: params.cityId,
    priceMin: number(params.priceMin),
    priceMax: number(params.priceMax),
    guests: number(params.guests),
    amenities: params.amenities?.split(",").filter(Boolean),
    lat: number(params.lat),
    lon: number(params.lon),
    radiusKm: number(params.radiusKm),
    page: number(params.page) ?? 1,
    limit: 12,
  };

  const [{ data: hotels, meta }, countries, amenities] = await Promise.all([
    searchHotels(query),
    getCountries(),
    getPublicAmenities("hotel"),
  ]);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10">
      <p className="kicker text-accent">Find a place</p>
      <h1 className="mt-1 text-4xl">Search</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[20rem_1fr]">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <Suspense
            fallback={<div className="h-[42rem] rounded border border-line" />}
          >
            <SearchFilters
              availableCountries={countries}
              amenities={amenities}
              hotels={hotels}
            />
          </Suspense>
        </aside>

        <section className="min-w-0">
          {hotels.length === 0 ? (
            <div className="rounded border border-line px-4 py-16 text-center">
              <p className="text-muted">No hotels match these filters.</p>
              <p className="mt-1 text-sm text-faint">
                Try widening the radius or clearing some filters.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {hotels.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>

              <Pagination
                page={meta.page}
                lastPage={meta.lastPage}
                total={meta.total}
                noun={["stay", "stays"]}
                params={Object.fromEntries(
                  Object.entries(params).filter(
                    ([key, value]) => key !== "page" && value !== undefined,
                  ) as [string, string][],
                )}
              />
            </>
          )}
        </section>
      </div>
    </main>
  );
}
