'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { createUpdateHotel } from '@/actions';
import { Field, fieldClass } from '@/components';
import type { Hotel } from '@/interfaces';
import { hotelSchema, type HotelInput } from '@/schemas';

import { HotelLocation } from './HotelLocation';

interface Props {
  hotel?: Hotel;
}

export const HotelForm = ({ hotel }: Props) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<HotelInput>({
    resolver: zodResolver(hotelSchema),
    defaultValues: {
      name: hotel?.name ?? '',
      description: hotel?.description ?? '',
      country: hotel?.country ?? '',
      city: hotel?.city ?? '',
      address: hotel?.address ?? '',
      latitude: hotel?.latitude ?? '',
      longitude: hotel?.longitude ?? '',
    },
  });

  const latitude = useWatch({ control, name: 'latitude' });
  const longitude = useWatch({ control, name: 'longitude' });

  const onSubmit = (data: HotelInput) => {
    setServerError(null);

    startTransition(async () => {
      const result = await createUpdateHotel(hotel?.id ?? null, data);

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
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" error={errors.name?.message} span>
          <input
            {...register('name')}
            placeholder="Gran Hotel Sierra"
            className={fieldClass(!!errors.name)}
          />
        </Field>

        <Field label="City" error={errors.city?.message}>
          <input
            {...register('city')}
            placeholder="Madrid"
            className={fieldClass(!!errors.city)}
          />
        </Field>

        <Field label="Country" error={errors.country?.message}>
          <input
            {...register('country')}
            placeholder="ES"
            className={fieldClass(!!errors.country)}
          />
        </Field>

        <Field label="Address" error={errors.address?.message} span>
          <input
            {...register('address')}
            placeholder="Calle Fuencarral 45"
            className={fieldClass(!!errors.address)}
          />
        </Field>

        <HotelLocation
          latitude={latitude}
          longitude={longitude}
          errors={{
            latitude: errors.latitude?.message,
            longitude: errors.longitude?.message,
          }}
          onChange={(latitude, longitude) => {
            setValue('latitude', latitude, { shouldValidate: true });
            setValue('longitude', longitude, { shouldValidate: true });
          }}
        />

        <Field label="Description" error={errors.description?.message} span>
          <textarea
            {...register('description')}
            rows={4}
            placeholder="Short summary, amenities, location notes."
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
          href="/admin/hotels"
          className="rounded border border-line px-4 py-2 text-sm transition-colors hover:border-accent hover:text-accent"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
};
