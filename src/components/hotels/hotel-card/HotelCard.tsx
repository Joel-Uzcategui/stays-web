import Link from 'next/link';
import { MapPin, Navigation, Users } from 'lucide-react';

import type { SearchHotel } from '@/interfaces';

interface Props {
  hotel: SearchHotel;
}

const price = (cents: number | null) =>
  cents === null ? null : Math.round(cents / 100);

export const HotelCard = ({ hotel }: Props) => {
  const from = price(hotel.priceFrom);

  return (
    <Link
      href={`/hotels/${hotel.id}`}
      className="group flex flex-col overflow-hidden rounded border border-line transition-colors hover:border-accent"
    >
      <div className="relative grid h-36 place-items-center bg-accent-tint">
        <span className="font-heading text-5xl text-accent/35">
          {hotel.name.charAt(0)}
        </span>

        {hotel.distanceKm !== null && (
          <span className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-xs text-accent-ink">
            <Navigation size={11} strokeWidth={2} />
            {hotel.distanceKm} km
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h2 className="font-heading text-lg leading-tight group-hover:text-accent">
          {hotel.name}
        </h2>

        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
          <MapPin
            size={13}
            strokeWidth={1.5}
            className="flex-none text-accent"
          />
          {hotel.city}, {hotel.country}
        </p>

        {hotel.description && (
          <p className="mt-2 line-clamp-2 text-sm text-muted">
            {hotel.description}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          {hotel.maxCapacity !== null && (
            <span className="flex items-center gap-1 text-xs text-faint">
              <Users size={12} strokeWidth={1.5} />
              up to {hotel.maxCapacity}
            </span>
          )}

          {from !== null && (
            <span className="text-right text-sm">
              <span className="kicker block text-faint">from</span>
              <span className="font-heading text-xl text-accent-ink">
                {from} €
              </span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
