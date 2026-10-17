import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";

import {
  checkAvailability,
  getHotel,
  getHotelAmenities,
  getHotelRoomTypes,
} from "@/actions";
import { StaticMap, Tag } from "@/components";
import countries from "@/data/countries.json";
import { addDays, isDay, today } from "@/lib/dates";

import { BookingPanel } from "./ui/BookingPanel";

const countryName = (code: string) =>
  countries.find((country) => country.code === code)?.name ?? code;

const money = (cents: number, currency: string) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);

const requestedStay = (params: Record<string, string | undefined>) => {
  const { checkIn, checkOut, guests } = params;
  const chosen = Math.min(Number(guests) || 2, 10);

  if (!isDay(checkIn) || !isDay(checkOut) || checkOut <= checkIn) {
    return {
      checkIn: addDays(today(), 14),
      checkOut: addDays(today(), 16),
      guests: chosen,
    };
  }

  return { checkIn, checkOut, guests: chosen };
};

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function HotelDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const stay = requestedStay(await searchParams);
  const hotel = await getHotel(id);

  if (!hotel) {
    notFound();
  }

  const [roomTypes, amenities, availableRooms] = await Promise.all([
    getHotelRoomTypes(id),
    getHotelAmenities(id),
    checkAvailability({ hotelId: id, ...stay, rooms: 1 }),
  ]);

  const coords =
    hotel.latitude && hotel.longitude
      ? { latitude: Number(hotel.latitude), longitude: Number(hotel.longitude) }
      : null;

  const cheapest = roomTypes.length
    ? Math.min(...roomTypes.map((room) => room.priceCents))
    : null;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <Link
        href="/search"
        className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent"
      >
        <ArrowLeft size={14} strokeWidth={1.5} />
        Back to search
      </Link>

      <header className="mt-5 border-b border-line pb-6">
        <p className="kicker text-accent">{countryName(hotel.country)}</p>
        <h1 className="mt-1 text-4xl">{hotel.name}</h1>

        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
          <MapPin
            size={14}
            strokeWidth={1.5}
            className="flex-none text-accent"
          />
          {hotel.address}, {hotel.city}
        </p>

        {cheapest !== null && (
          <p className="mt-4 text-sm text-muted">
            From{" "}
            <span className="font-heading text-2xl text-accent-ink">
              {money(cheapest, roomTypes[0].currency)}
            </span>{" "}
            per night
          </p>
        )}
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_20rem]">
        <div className="min-w-0">
          {hotel.description && (
            <section className="mb-8">
              <h2 className="kicker text-muted">About</h2>
              <p className="mt-2 leading-relaxed text-muted">
                {hotel.description}
              </p>
            </section>
          )}

          <BookingPanel
            hotelId={hotel.id}
            stay={stay}
            initialRooms={availableRooms}
          />
        </div>

        <aside className="flex flex-col gap-8">
          {coords && (
            <section>
              <h2 className="kicker mb-2 text-muted">Location</h2>
              <StaticMap {...coords} label={hotel.name} />
            </section>
          )}

          {amenities.length > 0 && (
            <section>
              <h2 className="kicker mb-2 text-muted">Amenities</h2>
              <div className="flex flex-wrap gap-1.5">
                {amenities.map((amenity) => (
                  <Tag key={amenity.id}>{amenity.name}</Tag>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </main>
  );
}
