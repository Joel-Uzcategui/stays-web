'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { createUpdateAmenity } from '@/actions';
import { Field, fieldClass } from '@/components';
import { AMENITY_SCOPES, type Amenity } from '@/interfaces';
import { amenitySchema, type AmenityInput } from '@/schemas';

const SCOPE_HINT: Record<string, string> = {
  hotel: 'Applies to the whole property',
  room: 'Applies to a room type',
  both: 'Can be assigned to either',
};

interface Props {
  amenity?: Amenity;
}

export const AmenityForm = ({ amenity }: Props) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AmenityInput>({
    resolver: zodResolver(amenitySchema),
    defaultValues: {
      code: amenity?.code ?? '',
      name: amenity?.name ?? '',
      scope: amenity?.scope ?? 'hotel',
    },
  });

  const onSubmit = (data: AmenityInput) => {
    setServerError(null);

    startTransition(async () => {
      const result = await createUpdateAmenity(amenity?.id ?? null, data);

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
        <Field label="Code" error={errors.code?.message}>
          <input
            {...register('code')}
            disabled={!!amenity}
            placeholder="air_conditioning"
            className={`${fieldClass(!!errors.code)} disabled:text-faint`}
          />
        </Field>

        <Field label="Name" error={errors.name?.message}>
          <input
            {...register('name')}
            placeholder="Aire acondicionado"
            className={fieldClass(!!errors.name)}
          />
        </Field>

        <Field label="Scope" error={errors.scope?.message} span>
          <select {...register('scope')} className={fieldClass(!!errors.scope)}>
            {AMENITY_SCOPES.map((scope) => (
              <option key={scope} value={scope}>
                {scope} — {SCOPE_HINT[scope]}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {amenity && (
        <p className="text-xs text-faint">
          The code identifies the amenity across the catalog and cannot be
          changed once created.
        </p>
      )}

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
          href="/admin/amenities"
          className="rounded border border-line px-4 py-2 text-sm transition-colors hover:border-accent hover:text-accent"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
};
