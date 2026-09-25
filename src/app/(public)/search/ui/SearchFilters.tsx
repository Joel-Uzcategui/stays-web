'use client';

import { useCallback, useMemo, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';

import { MultiSelect, type MultiSelectOption } from '@/components';
import countries from '@/data/countries.json';
import type { Amenity, SearchHotel } from '@/interfaces';
import { RADIUS_OPTIONS } from '@/interfaces';

import { SearchMap, type Point } from '@/components';

const countryName = (code: string) =>
  countries.find((country) => country.code === code)?.name ?? code;

interface Props {
  availableCountries: string[];
  amenities: Amenity[];
  hotels: SearchHotel[];
}

export const SearchFilters = ({
  availableCountries,
  amenities,
  hotels,
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  const [term, setTerm] = useState(params.get('q') ?? '');

  const lat = params.get('lat');
  const lon = params.get('lon');
  const point = lat && lon ? { lat: Number(lat), lon: Number(lon) } : null;
  const radiusKm = Number(params.get('radiusKm') ?? 5);

  const selected = useMemo(
    () =>
      (params.get('amenities')?.split(',').filter(Boolean) ?? []).map((code) => {
        const match = amenities.find((amenity) => amenity.code === code);

        return { id: code, label: match?.name ?? code };
      }),
    [params, amenities],
  );

  const push = useCallback(
    (changes: Record<string, string | null>) => {
      const next = new URLSearchParams(params);

      for (const [key, value] of Object.entries(changes)) {
        if (value === null || value === '') {
          next.delete(key);
        } else {
          next.set(key, value);
        }
      }

      next.delete('page');

      startTransition(() => router.push(`${pathname}?${next}`));
    },
    [params, pathname, router],
  );

  const pickPoint = useCallback(
    (picked: Point) =>
      push({
        lat: picked.lat.toFixed(6),
        lon: picked.lon.toFixed(6),
        radiusKm: String(radiusKm),
        country: null,
      }),
    [push, radiusKm],
  );

  const findAmenities = useCallback(
    (search: string) =>
      Promise.resolve(
        amenities
          .filter((amenity) =>
            amenity.name.toLowerCase().includes(search.toLowerCase()),
          )
          .slice(0, 20)
          .map((amenity) => ({ id: amenity.code, label: amenity.name })),
      ),
    [amenities],
  );

  const chip = (value: number) =>
    `rounded-full border px-3 py-1 text-xs transition-colors ${
      radiusKm === value
        ? 'border-accent bg-accent text-white'
        : 'border-line hover:border-accent hover:text-accent'
    }`;

  return (
    <div className={`flex flex-col gap-5 ${pending ? 'opacity-60' : ''}`}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          push({ q: term });
        }}
        className="flex gap-2"
      >
        <input
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="Hotel, city or address"
          className="min-w-0 flex-1 rounded border border-line bg-white/50 px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <button
          type="submit"
          aria-label="Search"
          className="grid w-10 flex-none place-items-center rounded bg-accent text-white transition-colors hover:bg-accent-deep"
        >
          <Search size={16} strokeWidth={2} />
        </button>
      </form>

      <div className="flex flex-col gap-1">
        <span className="kicker text-muted">Search area</span>
        <SearchMap
          point={point}
          radiusKm={radiusKm}
          hotels={hotels}
          onPick={pickPoint}
        />

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {RADIUS_OPTIONS.map((value) => (
            <button
              key={value}
              type="button"
              disabled={!point}
              onClick={() => push({ radiusKm: String(value) })}
              className={`${chip(value)} disabled:opacity-40`}
            >
              {value} km
            </button>
          ))}

          {point ? (
            <button
              type="button"
              onClick={() => push({ lat: null, lon: null, radiusKm: null })}
              className="ml-auto flex items-center gap-1 text-xs text-muted transition-colors hover:text-danger"
            >
              <X size={12} strokeWidth={2} />
              Clear point
            </button>
          ) : (
            <span className="ml-auto text-xs text-faint">
              Click the map to search by area
            </span>
          )}
        </div>
      </div>

      <label className="flex flex-col gap-1">
        <span className="kicker text-muted">Country</span>
        <select
          value={params.get('country') ?? ''}
          disabled={!!point}
          onChange={(event) => push({ country: event.target.value })}
          className="rounded border border-line bg-white/50 px-3 py-2 text-sm outline-none focus:border-accent disabled:opacity-45"
        >
          <option value="">Any country</option>
          {availableCountries.map((code) => (
            <option key={code} value={code}>
              {countryName(code)}
            </option>
          ))}
        </select>
        {point && (
          <span className="text-xs text-faint">
            Disabled while searching by map area
          </span>
        )}
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1">
          <span className="kicker text-muted">Min € </span>
          <input
            type="number"
            min={0}
            defaultValue={
              params.get('priceMin')
                ? Number(params.get('priceMin')) / 100
                : undefined
            }
            onBlur={(event) =>
              push({
                priceMin: event.target.value
                  ? String(Number(event.target.value) * 100)
                  : null,
              })
            }
            className="rounded border border-line bg-white/50 px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="kicker text-muted">Max €</span>
          <input
            type="number"
            min={0}
            defaultValue={
              params.get('priceMax')
                ? Number(params.get('priceMax')) / 100
                : undefined
            }
            onBlur={(event) =>
              push({
                priceMax: event.target.value
                  ? String(Number(event.target.value) * 100)
                  : null,
              })
            }
            className="rounded border border-line bg-white/50 px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span className="kicker text-muted">Guests</span>
        <select
          value={params.get('guests') ?? ''}
          onChange={(event) => push({ guests: event.target.value })}
          className="rounded border border-line bg-white/50 px-3 py-2 text-sm outline-none focus:border-accent"
        >
          <option value="">Any</option>
          {[1, 2, 3, 4, 5, 6].map((value) => (
            <option key={value} value={value}>
              {value}+
            </option>
          ))}
        </select>
      </label>

      <MultiSelect
        label="Amenities"
        selected={selected}
        onChange={(options: MultiSelectOption[]) =>
          push({
            amenities: options.map((option) => option.id).join(',') || null,
          })
        }
        search={findAmenities}
        placeholder="Filter by amenities"
      />
    </div>
  );
};
