import Link from 'next/link';

const year = new Date().getFullYear();

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-6 text-sm text-muted">
        <p className="font-heading text-base text-accent-ink">
          Uzcategui Stays
        </p>

        <nav className="flex gap-5">
          <Link href="/" className="transition-colors hover:text-accent">
            Home
          </Link>
          <Link href="/search" className="transition-colors hover:text-accent">
            Search
          </Link>
          <Link
            href="/me/bookings"
            className="transition-colors hover:text-accent"
          >
            Bookings
          </Link>
        </nav>

        <p className="ml-auto text-xs text-faint">
          © {year} Uzcategui Stays. Built by{' '}
          <a
            href="https://joel-uzcategui.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted underline decoration-line underline-offset-2 transition-colors hover:text-accent hover:decoration-accent"
          >
            Joel Uzcategui
          </a>
        </p>
      </div>
    </footer>
  );
};
