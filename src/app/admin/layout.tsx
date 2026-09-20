import Link from 'next/link';
import { LogOut } from 'lucide-react';

import { logout } from '@/actions';
import { AdminSidebar } from '@/components';
import { getCurrentUser } from '@/lib/session-store';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen items-stretch">
      <aside className="sticky top-0 hidden h-screen w-58 flex-none flex-col gap-6 border-r border-line p-4 md:flex">
        <Link href="/" className="flex items-center gap-2.5 px-2 pt-1">
          <span className="grid size-7 flex-none place-items-center border border-accent">
            <span className="size-2.5 bg-accent" />
          </span>
          <span>
            <span className="block font-heading text-lg leading-none tracking-wide">
              UZCATEGUI
            </span>
            <span className="kicker block text-faint">Admin console</span>
          </span>
        </Link>

        <AdminSidebar />

        <div className="mt-auto rounded border border-line p-3">
          <p className="kicker text-accent">Signed in</p>
          <p className="mt-1 truncate font-heading text-base" title={user?.email}>
            {user?.email}
          </p>
          <p className="text-xs text-muted capitalize">{user?.role}</p>

          <form action={logout} className="mt-2.5">
            <button
              type="submit"
              className="flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-accent"
            >
              <LogOut size={13} strokeWidth={1.5} />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">{children}</main>
    </div>
  );
}
