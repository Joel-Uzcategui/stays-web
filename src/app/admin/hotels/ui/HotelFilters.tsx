'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search } from 'lucide-react';

import { CityCombobox, type CitySelection } from '@/components';
import countries from '@/data/countries.json';

const MIN_TERM = 3;

interface Props {
  available: string[];
  active: boolean;
  q?: string;
  country?: string;
  cityId?: string;
  cityName?: string;
}

const named = (code: string) =>
  countries.find((country) => country.code === code)?.name ?? code;

export const HotelFilters = ({
  available,
  active,
  q,
  country,
  cityId,
  cityName,
}: Props) => {
  const router = useRouter();

  const [term, setTerm] = useState(q ?? '');
  const [iso, setIso] = useState(country ?? '');
  const [city, setCity] = useState<CitySelection>({
    id: cityId ?? null,
    name: cityName ?? '',
  });

  const trimmed = term.trim();
  const short = trimmed.length > 0 && trimmed.length < MIN_TERM;
  const dirty = !!q || !!country || !!cityId;

  const options = available
    .map((code) => ({ code, name: named(code) }))
    .sort((left, right) => left.name.localeCompare(right.name));

  const apply = (event: React.FormEvent) => {
    event.preventDefault();

    const params = new URLSearchParams({ active: String(active) });

    if (trimmed.length >= MIN_TERM) {
      params.set('q', trimmed);
    }

    if (iso) {
      params.set('country', iso);
    }

    if (city.id) {
      params.set('cityId', city.id);
      params.set('city', city.name);
    }

    router.push(`/admin/hotels?${params}`);
  };

  return (
    <form onSubmit={apply} className="flex flex-wrap items-end gap-2">
      <div className="flex flex-col gap-1">
        <span className="kicker text-muted">Name</span>
        <div className="relative flex items-center">
          <Search
            size={15}
            strokeWidth={1.5}
            className="pointer-events-none absolute left-2.5 text-faint"
          />
          <input
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Search by name"
            className={`w-60 rounded border bg-white/50 py-2 pr-3 pl-8 text-sm placeholder:text-faint ${
              short ? 'border-danger' : 'border-line'
            }`}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="kicker text-muted">Country</span>
        <select
          value={iso}
          onChange={(event) => {
            setIso(event.target.value);
            setCity({ id: null, name: '' });
          }}
          className="rounded border border-line bg-white/50 px-3 py-2 text-sm"
        >
          <option value="">All countries</option>
          {options.map(({ code, name }) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="w-56">
        <CityCombobox
          label="City"
          value={city.name}
          country={iso || undefined}
          placeholder="All cities"
          onChange={setCity}
        />
      </div>

      <button
        type="submit"
        className="rounded border border-line px-3 py-2 text-sm transition-colors hover:border-accent hover:text-accent"
      >
        Search
      </button>

      {dirty && (
        <Link
          href="/admin/hotels"
          className="px-1 pb-2 text-xs text-muted transition-colors hover:text-accent"
        >
          Clear
        </Link>
      )}

      {short && (
        <p className="w-full text-xs text-danger">
          Type at least {MIN_TERM} characters to search by name
        </p>
      )}
    </form>
  );
};
