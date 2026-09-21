'use client';

import Link from 'next/link';
import { useCallback, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { createUpdateRoomType, searchAmenities } from '@/actions';
import {
  Field,
  fieldClass,
  MultiSelect,
  type MultiSelectOption,
} from '@/components';
import type { Hotel, RoomType } from '@/interfaces';
import { roomTypeSchema, toPrice, type RoomTypeInput } from '@/schemas';

interface Props {
  hotels: Hotel[];
  roomType?: RoomType;
}

export const RoomTypeForm = ({ hotels, roomType }: Props) => {
  const [amenities, setAmenities] = useState<MultiSelectOption[]>(
    roomType?.amenities?.map(({ id, name }) => ({ id, label: name })) ?? [],
  );
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RoomTypeInput>({
    resolver: zodResolver(roomTypeSchema),
    defaultValues: {
      hotelId: roomType?.hotelId ?? '',
      name: roomType?.name ?? '',
      description: roomType?.description ?? '',
      capacity: String(roomType?.capacity ?? '2'),
      price: roomType ? toPrice(roomType.priceCents) : '',
      defaultUnits: String(roomType?.defaultUnits ?? '1'),
      amenityIds: roomType?.amenities?.map((amenity) => amenity.id) ?? [],
    },
  });

  const findAmenities = useCallback(
    async (term: string) =>
      (await searchAmenities({ q: term || undefined, scope: 'room' })).map(
        ({ id, name }) => ({ id, label: name }),
      ),
    [],
  );

  const onSubmit = (data: RoomTypeInput) => {
    setServerError(null);

    startTransition(async () => {
      const result = await createUpdateRoomType(roomType?.id ?? null, data);

      if (result?.message) {
        setServerError(result.message);
      }
    });
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex max-w-2xl flex-col gap-4"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Hotel" error={errors.hotelId?.message} span>
          <select
            {...register('hotelId')}
            disabled={!!roomType}
            className={fieldClass(!!errors.hotelId)}
          >
            <option value="">Pick a hotel</option>
            {hotels.map((hotel) => (
              <option key={hotel.id} value={hotel.id}>
                {hotel.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Name" error={errors.name?.message} span>
          <input
            {...register('name')}
            placeholder="Doble Superior"
            className={fieldClass(!!errors.name)}
          />
        </Field>

        <Field label="Capacity" error={errors.capacity?.message}>
          <input
            {...register('capacity')}
            inputMode="numeric"
            placeholder="2"
            className={`${fieldClass(!!errors.capacity)} tabular-nums`}
          />
        </Field>

        <Field label="Price per night (EUR)" error={errors.price?.message}>
          <input
            {...register('price')}
            inputMode="decimal"
            placeholder="125.00"
            className={`${fieldClass(!!errors.price)} tabular-nums`}
          />
        </Field>

        <Field label="Units" error={errors.defaultUnits?.message}>
          <input
            {...register('defaultUnits')}
            inputMode="numeric"
            placeholder="8"
            className={`${fieldClass(!!errors.defaultUnits)} tabular-nums`}
          />
        </Field>

        <div className="sm:col-span-3">
          <MultiSelect
            label="Amenities"
            selected={amenities}
            onChange={(options) => {
              setAmenities(options);
              setValue(
                'amenityIds',
                options.map((option) => option.id),
              );
            }}
            search={findAmenities}
            placeholder="Search and select amenities"
          />
        </div>

        <Field label="Description" error={errors.description?.message} span>
          <textarea
            {...register('description')}
            rows={4}
            placeholder="What the room has, view, bed layout."
            className={fieldClass(!!errors.description)}
          />
        </Field>
      </div>

      {serverError && (
        <p className="rounded border border-danger/25 bg-danger-tint px-3 py-2 text-sm text-danger">
          {serverError}
        </p>
      )}

      <div className="mt-2 flex items-center gap-3 border-t border-line pt-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-deep disabled:opacity-45"
        >
          {pending ? 'Saving…' : 'Save'}
        </button>

        <Link
          href="/admin/room-types"
          className="rounded border border-line px-4 py-2 text-sm transition-colors hover:border-accent hover:text-accent"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
};
