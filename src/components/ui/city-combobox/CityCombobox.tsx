'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { MapPin, Plus, TriangleAlert } from 'lucide-react';

import { searchCities } from '@/actions';
import { FieldError } from '@/components';
import type { City } from '@/interfaces';

const DEBOUNCE_MS = 200;

const fold = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

export interface CitySelection {
  id: string | null;
  name: string;
}

interface Props {
  label: string;
  value: string;
  onChange: (selection: CitySelection) => void;
  country?: string;
  countryLabel?: string;
  allowCreate?: boolean;
  placeholder?: string;
  error?: string;
}

export const CityCombobox = ({
  label,
  value,
  onChange,
  country,
  countryLabel,
  allowCreate = false,
  placeholder = 'Search a city',
  error,
}: Props) => {
  const box = useRef<HTMLDivElement>(null);
  const listId = useId();

  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<City[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const [synced, setSynced] = useState(value);

  if (value !== synced) {
    setSynced(value);
    setQuery(value);
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    const handle = setTimeout(async () => {
      setLoading(true);

      try {
        setResults(
          await searchCities({ q: query.trim() || undefined, country }),
        );
        setFailed(false);
      } catch {
        setResults([]);
        setFailed(true);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(handle);
  }, [query, country, open]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!box.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const typed = query.trim();
  const matched = results.some((city) => fold(city.name) === fold(typed));
  const missing = allowCreate && typed.length > 0 && !matched && !failed;
  const creatable = missing && !!country;

  const options = creatable ? results.length + 1 : results.length;

  const pick = (city: City) => {
    onChange({ id: city.id, name: city.name });
    setQuery(city.name);
    setOpen(false);
  };

  const create = () => {
    onChange({ id: null, name: typed });
    setOpen(false);
  };

  const choose = (index: number) => {
    if (index < results.length) {
      pick(results[index]);
      return;
    }

    if (creatable) {
      create();
    }
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setOpen(false);
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setOpen(true);

      if (options > 0) {
        const step = event.key === 'ArrowDown' ? 1 : options - 1;
        setHighlight((current) => (current + step) % options);
      }

      return;
    }

    if (event.key === 'Enter' && open) {
      event.preventDefault();
      choose(highlight);
    }
  };

  const row = (active: boolean) =>
    `flex w-full items-center gap-2 px-3 py-2 text-left text-sm ${
      active ? 'bg-accent-tint text-accent-ink' : ''
    }`;

  return (
    <div className="relative flex flex-col gap-1" ref={box}>
      <span className="kicker text-muted">{label}</span>

      <input
        value={query}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        autoComplete="off"
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        onChange={(event) => {
          setQuery(event.target.value);
          setHighlight(0);
          setOpen(true);
          onChange({ id: null, name: event.target.value });
        }}
        className={`rounded border bg-white/50 px-3 py-2 text-sm placeholder:text-faint ${
          error ? 'border-danger' : 'border-line'
        }`}
      />

      {open && (
        <div
          id={listId}
          role="listbox"
          onMouseDown={(event) => event.preventDefault()}
          className="absolute top-full right-0 left-0 z-20 mt-1 overflow-hidden rounded border border-line bg-white shadow-lg"
        >
          {results.map((city, index) => (
            <button
              key={city.id}
              type="button"
              onMouseEnter={() => setHighlight(index)}
              onClick={() => pick(city)}
              className={row(highlight === index)}
            >
              <MapPin size={14} strokeWidth={1.5} className="text-faint" />
              {city.name}
            </button>
          ))}

          {results.length === 0 && !missing && (
            <p className="px-3 py-2 text-sm text-faint">
              {loading
                ? 'Searching…'
                : failed
                  ? 'Could not load cities'
                  : 'No cities yet'}
            </p>
          )}

          {missing && !country && (
            <p className="flex items-center gap-2 border-t border-line px-3 py-2 text-sm text-muted first:border-0">
              <TriangleAlert size={14} strokeWidth={1.5} className="text-danger" />
              Pick a country before creating a city
            </p>
          )}

          {creatable && (
            <button
              type="button"
              onMouseEnter={() => setHighlight(results.length)}
              onClick={create}
              className={`${row(highlight === results.length)} border-t border-line first:border-0`}
            >
              <Plus size={14} strokeWidth={1.5} className="text-accent" />
              Create &laquo;{typed}&raquo; in {countryLabel ?? country}
            </button>
          )}
        </div>
      )}

      <FieldError message={error} />
    </div>
  );
};
