import type { Hotel } from '@/interfaces';

import { HotelGridItem } from './HotelGridItem';

interface Props {
  hotels: Hotel[];
}

export const HotelGrid = ({ hotels }: Props) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {hotels.map((hotel) => (
        <HotelGridItem key={hotel.id} hotel={hotel} />
      ))}
    </div>
  );
};
