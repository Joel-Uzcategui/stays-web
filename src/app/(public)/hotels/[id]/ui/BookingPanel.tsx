"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { CalendarCheck, Users } from "lucide-react";

import { checkAvailability, createBooking } from "@/actions";
import { Stepper } from "@/components";
import type { Booking, RoomAvailability } from "@/interfaces";
import { addDays, today } from "@/lib/dates";

const MAX_ROOMS = 10;

const money = (cents: number, currency: string) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);

const field =
  "w-full rounded border border-line bg-white/50 px-2.5 py-2 text-sm outline-none focus:border-accent";

interface Props {
  hotelId: string;
  stay?: { checkIn: string; checkOut: string; guests: number };
}

export const BookingPanel = ({ hotelId, stay }: Props) => {
  const [checkIn, setCheckIn] = useState(stay?.checkIn ?? addDays(today(), 14));
  const [checkOut, setCheckOut] = useState(
    stay?.checkOut ?? addDays(today(), 16),
  );
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(stay?.guests ?? 2);

  const [results, setResults] = useState<RoomAvailability[] | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [pending, startTransition] = useTransition();

  const query = { hotelId, checkIn, checkOut, rooms, guests };

  const setRoomCount = (value: number) => {
    setRooms(value);
    setGuests((current) => Math.max(current, value));
  };

  const search = () => {
    setError(null);
    setBooking(null);

    if (checkOut <= checkIn) {
      setError("Check-out must be after check-in");
      return;
    }

    startTransition(async () => {
      setResults(await checkAvailability(query));
    });
  };

  const reserve = (roomTypeId: string) => {
    setError(null);
    setNeedsLogin(false);

    startTransition(async () => {
      const result = await createBooking({
        roomTypeId,
        checkIn,
        checkOut,
        units: rooms,
      });

      if (result.ok) {
        setBooking(result.booking);
        setResults(await checkAvailability(query));
        return;
      }

      setError(result.error);
      setNeedsLogin(result.needsLogin ?? false);
    });
  };

  return (
    <section className="rounded border border-line p-4">
      <h2 className="kicker text-muted">Check availability</h2>

      <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-faint">Check-in</span>
          <input
            type="date"
            value={checkIn}
            min={today()}
            onChange={(event) => setCheckIn(event.target.value)}
            className={field}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs text-faint">Check-out</span>
          <input
            type="date"
            value={checkOut}
            min={addDays(checkIn, 1)}
            onChange={(event) => setCheckOut(event.target.value)}
            className={field}
          />
        </label>
      </div>

      <div className="mt-3 flex flex-col gap-2.5 rounded border border-line px-3 py-2.5">
        <Stepper
          label="Rooms"
          value={rooms}
          max={MAX_ROOMS}
          onChange={setRoomCount}
        />
        <Stepper
          label="Guests"
          hint={rooms > 1 ? `Across ${rooms} rooms` : undefined}
          value={guests}
          min={rooms}
          max={rooms * 20}
          onChange={setGuests}
        />
      </div>

      <button
        type="button"
        onClick={search}
        disabled={pending}
        className="mt-3 w-full rounded bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Checking…" : "Check availability"}
      </button>

      {error && (
        <p className="mt-3 rounded border border-line bg-white/50 px-3 py-2 text-sm text-muted">
          {error}
          {needsLogin && (
            <>
              {" "}
              <Link href="/auth/login" className="text-accent underline">
                Sign in
              </Link>
            </>
          )}
        </p>
      )}

      {booking && (
        <div className="mt-3 rounded border border-accent bg-accent-tint px-3 py-2.5 text-sm">
          <p className="flex items-center gap-1.5 font-medium text-accent-ink">
            <CalendarCheck size={14} strokeWidth={1.5} />
            {booking.units === 1
              ? "Room held for you"
              : `${booking.units} rooms held for you`}
          </p>
          <p className="mt-1 text-muted">
            {money(booking.totalCents, booking.currency)} · pay within 15
            minutes or the hold is released
          </p>
          <Link
            href={`/bookings/${booking.bookingId}/pay`}
            className="mt-2 inline-block rounded bg-accent px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90"
          >
            Pay now
          </Link>
        </div>
      )}

      {results !== null && (
        <ul className="mt-4 flex flex-col gap-2 border-t border-line pt-4">
          {results.length === 0 && (
            <li className="text-sm text-faint">
              No room type fits {guests} {guests === 1 ? "guest" : "guests"} in{" "}
              {rooms} {rooms === 1 ? "room" : "rooms"} on those dates.
            </li>
          )}

          {results.map((room) => {
            const enough = room.unitsLeft >= room.rooms;

            return (
              <li
                key={room.roomTypeId}
                className="flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded border border-line px-3 py-2.5"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-heading leading-tight">
                    {room.rooms > 1 && `${room.rooms} × `}
                    {room.name}
                  </p>
                  <p className="mt-0.5 flex items-center gap-2 text-xs text-faint">
                    <span className="flex items-center gap-1">
                      <Users size={11} strokeWidth={1.5} />
                      sleeps {room.sleeps}
                    </span>
                    <span>
                      {enough
                        ? `${room.unitsLeft} left`
                        : room.unitsLeft === 0
                          ? "Sold out"
                          : `only ${room.unitsLeft} left`}
                    </span>
                  </p>
                </div>

                <span className="font-heading text-lg text-accent-ink">
                  {money(room.totalPrice, room.currency)}
                  <span className="ml-1 text-xs font-normal text-faint">
                    / {room.nights} {room.nights === 1 ? "night" : "nights"}
                  </span>
                </span>

                <button
                  type="button"
                  disabled={!enough || pending}
                  onClick={() => reserve(room.roomTypeId)}
                  className="rounded border border-accent px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-accent"
                >
                  Reserve
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};
