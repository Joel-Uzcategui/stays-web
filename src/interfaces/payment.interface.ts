export type PaymentStatus =
  | 'pending'
  | 'requires_action'
  | 'succeeded'
  | 'failed'
  | 'cancelled'
  | 'refunded';

export interface Payment {
  paymentId: string;
  bookingId: string;
  status: PaymentStatus;
  amountCents: number;
  currency: string;
  cardBrand: string | null;
  cardLast4: string | null;
  receiptUrl: string | null;
  failureReason: string | null;
  clientSecret?: string;
}
