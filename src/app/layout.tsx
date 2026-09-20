import type { Metadata } from 'next';

import { barlow, barlowCondensed } from '@/config/fonts';

import './globals.css';

export const metadata: Metadata = {
  title: 'Uzcategui Stays',
  description: 'Hotel booking system',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${barlow.variable} ${barlowCondensed.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
