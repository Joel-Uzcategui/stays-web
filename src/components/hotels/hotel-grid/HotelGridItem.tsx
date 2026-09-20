import { MapPin } from 'lucide-react';

import type { Hotel } from '@/interfaces';

interface Props {
  hotel: Hotel;
}

export const HotelGridItem = ({ hotel }: Props) => {
  return (
    <article className="flex flex-col rounded border border-line p-5 transition-colors hover:border-accent">
      <h2 className="font-heading text-xl leading-tight">{hotel.name}</h2>

      <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted">
        <MapPin size={14} strokeWidth={1.5} className="flex-none text-accent" />
        {hotel.city}, {hotel.country}
      </p>

      {hotel.description && (
        <p className="mt-3 line-clamp-2 text-sm text-muted">
          {hotel.description}
        </p>
      )}
    </article>
  );
};
