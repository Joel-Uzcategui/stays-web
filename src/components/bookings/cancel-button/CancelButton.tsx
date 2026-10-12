'use client';

import { useState, useTransition } from 'react';

import { cancelBooking } from '@/actions';

interface Props {
  bookingId: string;
}

export const CancelButton = ({ bookingId }: Props) => {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const cancel = () =>
    startTransition(async () => {
      const result = await cancelBooking(bookingId);

      setError(result.ok ? null : result.error);
    });

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={cancel}
        disabled={pending}
        className="rounded border border-line px-3 py-1.5 text-xs transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
      >
        {pending ? 'Cancelling…' : 'Cancel'}
      </button>

      {error && <p className="text-xs text-faint">{error}</p>}
    </div>
  );
};
