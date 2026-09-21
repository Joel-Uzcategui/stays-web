'use client';

import Link from 'next/link';
import { useCallback, useState, useTransition } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { createUpdateHotel, searchAmenities } from '@/actions';
import {
  CityCombobox,
  Field,
  fieldClass,
  MultiSelect,
  type MultiSelectOption,
} from '@/components';
import countries from '@/data/countries.json';
import type { Hotel } from '@/interfaces';
import { hotelSchema, type HotelInput } from '@/schemas';

import { HotelLocation } from './HotelLocation';

const countryName = (code: string) =>
  countries.find((country) => country.code === code)?.name;

interface Props {
  hotel?: Hotel;
}

export const HotelForm = ({ hotel }: Props) => {
  const [amenities, setAmenities] = useState<MultiSelectOption[]>(
    hotel?.amenities?.map(({ id, name }) => ({ id, label: name })) ?? [],
  );
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
      amenityIds: hotel?.amenities?.map((amenity) => amenity.id) ?? [],
      latitude: hotel?.latitude ?? '',
      longitude: hotel?.longitude ?? '',
    },
  });

  const latitude = useWatch({ control, name: 'latitude' });
  const longitude = useWatch({ control, name: 'longitude' });
  const country = useWatch({ control, name: 'country' });
  const city = useWatch({ control, name: 'city' });

  const findAmenities = useCallback(
    async (term: string) =>
      (await searchAmenities({ q: term || undefined, scope: 'hotel' })).map(
        ({ id, name }) => ({ id, label: name }),
      ),
    [],
  );

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

        <Field label="Country" error={errors.country?.message}>
          <select
            {...register('country', {
              onChange: () => setValue('city', '', { shouldValidate: false }),
            })}
            className={fieldClass(!!errors.country)}
          >
            <option value="">Select a country</option>
            {countries.map(({ code, name }) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </Field>

        <CityCombobox
          label="City"
          value={city}
          country={country || undefined}
          countryLabel={countryName(country)}
          allowCreate
          error={errors.city?.message}
          onChange={({ name }) =>
            setValue('city', name, { shouldValidate: !!errors.city })
          }
        />

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

        <div className="sm:col-span-2">
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
