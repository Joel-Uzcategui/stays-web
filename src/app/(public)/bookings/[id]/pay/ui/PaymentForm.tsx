'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CalendarCheck } from 'lucide-react';

import { getBookingStatus } from '@/actions';

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '';
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

const POLL_ATTEMPTS = 20;
const POLL_INTERVAL = 1000;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const waitForConfirmation = async (bookingId: string) => {
  for (let attempt = 0; attempt < POLL_ATTEMPTS; attempt++) {
    const status = await getBookingStatus(bookingId);

    if (status === 'confirmed') {
      return true;
    }

    await delay(POLL_INTERVAL);
  }

  return false;
};

const money = (cents: number, currency: string) =>
  new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);

type Stage = 'idle' | 'paying' | 'confirming' | 'confirmed' | 'slow';

interface Props {
  bookingId: string;
  clientSecret: string;
  amountCents: number;
  currency: string;
}

export const PaymentForm = ({ clientSecret, ...rest }: Props) => {
  if (!stripePromise) {
    return (
      <p className="rounded border border-line bg-white/50 px-3 py-2 text-sm text-muted">
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set.
      </p>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret, appearance: { theme: 'flat' } }}
    >
      <Form {...rest} />
    </Elements>
  );
};

const Form = ({
  bookingId,
  amountCents,
  currency,
}: Omit<Props, 'clientSecret'>) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const searchParams = useSearchParams();

  const returned = searchParams.get('redirect_status') === 'succeeded';

  const [stage, setStage] = useState<Stage>(returned ? 'confirming' : 'idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!returned) {
      return;
    }

    void waitForConfirmation(bookingId).then((confirmed) => {
      setStage(confirmed ? 'confirmed' : 'slow');
      router.refresh();
    });
  }, [returned, bookingId, router]);

  const pay = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setError(null);
    setStage('paying');

    const result = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
      confirmParams: {
        return_url: `${window.location.origin}/bookings/${bookingId}/pay`,
      },
    });

    if (result.error) {
      setError(result.error.message ?? 'The payment could not be completed');
      setStage('idle');

      return;
    }

    setStage('confirming');

    const confirmed = await waitForConfirmation(bookingId);

    setStage(confirmed ? 'confirmed' : 'slow');
    router.refresh();
  };

  if (stage === 'confirmed') {
    return (
      <div className="rounded border border-accent bg-accent-tint px-4 py-5 text-sm">
        <p className="flex items-center gap-1.5 font-medium text-accent-ink">
          <CalendarCheck size={15} strokeWidth={1.5} />
          Your booking is confirmed
        </p>
        <p className="mt-1 text-muted">
          {money(amountCents, currency)} paid ·{' '}
          <Link href="/me/bookings" className="text-accent underline">
            See your bookings
          </Link>
        </p>
      </div>
    );
  }

  if (stage === 'slow') {
    return (
      <div className="rounded border border-line px-4 py-5 text-sm">
        <p className="font-medium">Your payment went through</p>
        <p className="mt-1 text-muted">
          The booking is taking longer than usual to confirm.{' '}
          <Link href="/me/bookings" className="text-accent underline">
            Check your bookings
          </Link>{' '}
          in a moment.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={pay} className="flex flex-col gap-4">
      <PaymentElement />

      {error && (
        <p className="rounded border border-line bg-white/50 px-3 py-2 text-sm text-muted">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!stripe || stage !== 'idle'}
        className="w-full rounded bg-accent px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {stage === 'paying' && 'Paying…'}
        {stage === 'confirming' && 'Confirming your booking…'}
        {stage === 'idle' && `Pay ${money(amountCents, currency)}`}
      </button>
    </form>
  );
};
