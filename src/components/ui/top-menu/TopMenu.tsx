import Link from "next/link";

import { logout } from "@/actions";
import type { AccessTokenPayload } from "@/lib/session";

import { Brand } from "../brand/Brand";

const link = "kicker text-muted transition-colors hover:text-accent";

interface Props {
  user: AccessTokenPayload | null;
}

export const TopMenu = ({ user }: Props) => (
  <header className="sticky top-0 z-10 border-b border-line bg-ground/85 backdrop-blur">
    <nav className="mx-auto flex h-16 max-w-5xl items-center gap-5 px-4">
      <Brand />

      {!user && (
        <>
          <Link href="/auth/login" className={`${link} ml-auto`}>
            Sign in
          </Link>
          <Link
            href="/auth/register"
            className="rounded bg-accent px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-accent-deep"
          >
            Register
          </Link>
        </>
      )}

      {user && (
        <>
          <Link href="/me/bookings" className={`${link} ml-auto`}>
            Your stays
          </Link>

          {user.role === "admin" && (
            <Link href="/admin" className={link}>
              Admin
            </Link>
          )}

          <form action={logout}>
            <button type="submit" className={link}>
              Sign out
            </button>
          </form>
        </>
      )}
    </nav>
  </header>
);
