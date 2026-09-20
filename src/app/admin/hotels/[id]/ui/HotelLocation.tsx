'use client';

import dynamic from 'next/dynamic';
import { X } from 'lucide-react';

import { FieldError, fieldClass } from '@/components';
import type { Coords } from '@/components/ui/location-map/LocationMap';

const LocationMap = dynamic(
  () =>
    import('@/components/ui/location-map/LocationMap').then(
      (m) => m.LocationMap,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-72 place-items-center rounded border border-line text-sm text-faint">
        Loading map…
      </div>
    ),
  },
);

interface Props {
  latitude: string;
  longitude: string;
  errors: { latitude?: string; longitude?: string };
  onChange: (latitude: string, longitude: string) => void;
}

const PRECISION = 6;

const toCoords = (lat: string, lng: string): Coords | null => {
  if (lat.trim() === '' || lng.trim() === '') {
    return null;
  }

  const latitude = Number(lat);
  const longitude = Number(lng);

  return Number.isFinite(latitude) && Number.isFinite(longitude)
    ? { latitude, longitude }
    : null;
};

const round = (value: number) => String(Number(value.toFixed(PRECISION)));

export const HotelLocation = ({
  latitude,
  longitude,
  errors,
  onChange,
}: Props) => {
  const coords = toCoords(latitude, longitude);

  return (
    <div className="flex flex-col gap-3 sm:col-span-2">
      <div className="flex flex-wrap items-start gap-3">
        <label className="flex flex-col gap-1">
          <span className="kicker text-muted">Latitude</span>
          <input
            name="latitude"
            inputMode="decimal"
            placeholder="40.416800"
            value={latitude}
            onChange={(e) => onChange(e.target.value, longitude)}
            className={`${fieldClass(!!errors.latitude)} w-36 tabular-nums`}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="kicker text-muted">Longitude</span>
          <input
            name="longitude"
            inputMode="decimal"
            placeholder="-3.703800"
            value={longitude}
            onChange={(e) => onChange(latitude, e.target.value)}
            className={`${fieldClass(!!errors.longitude)} w-36 tabular-nums`}
          />
        </label>

        {coords && (
          <button
            type="button"
            onClick={() => onChange('', '')}
            className="flex items-center gap-1 pt-6 text-sm text-muted transition-colors hover:text-accent"
          >
            <X size={14} strokeWidth={1.5} />
            Clear
          </button>
        )}
      </div>

      <FieldError message={errors.latitude ?? errors.longitude} />

      <LocationMap
        coords={coords}
        onPick={({ latitude: lat, longitude: lng }) =>
          onChange(round(lat), round(lng))
        }
      />

      <p className="text-xs text-faint">
        Click the map or drag the pin to set the location.
      </p>
    </div>
  );
};
