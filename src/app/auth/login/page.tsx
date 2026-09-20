import Link from 'next/link';

import { LoginForm } from './ui/LoginForm';

interface Props {
  searchParams: Promise<{ redirectTo?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const { redirectTo } = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center px-4 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid size-7 flex-none place-items-center border border-accent">
            <span className="size-2.5 bg-accent" />
          </span>
          <span className="font-heading text-lg leading-none tracking-wide">
            UZCATEGUI <span className="text-accent">STAYS</span>
          </span>
        </Link>

        <p className="kicker mt-7 text-accent">Admin console</p>
        <h1 className="mt-1 mb-7 text-3xl">Sign in</h1>

        <LoginForm redirectTo={redirectTo ?? '/admin'} />
      </div>
    </main>
  );
}
