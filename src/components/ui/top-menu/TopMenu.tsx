import Link from 'next/link';

export const TopMenu = () => {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-ground/85 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-5xl items-center gap-3 px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid size-7 flex-none place-items-center border border-accent">
            <span className="size-2.5 bg-accent" />
          </span>
          <span className="font-heading text-lg leading-none tracking-wide">
            UZCATEGUI <span className="text-accent">STAYS</span>
          </span>
        </Link>

        <Link
          href="/admin"
          className="kicker ml-auto text-muted transition-colors hover:text-accent"
        >
          Admin
        </Link>
      </nav>
    </header>
  );
};
