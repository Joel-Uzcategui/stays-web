import Link from "next/link";

import { Brand } from "@/components";

import { LoginForm } from "./ui/LoginForm";

interface Props {
  searchParams: Promise<{ redirectTo?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const { redirectTo } = await searchParams;
  const back = redirectTo
    ? `?redirectTo=${encodeURIComponent(redirectTo)}`
    : "";

  return (
    <main className="grid min-h-screen place-items-center px-4 py-12">
      <div className="w-full max-w-sm">
        <Brand />

        <p className="kicker mt-7 text-accent">Welcome back</p>
        <h1 className="mt-1 mb-7 text-3xl">Sign in</h1>

        <LoginForm redirectTo={redirectTo ?? ""} />

        <p className="mt-5 text-sm text-muted">
          New here?{" "}
          <Link
            href={`/auth/register${back}`}
            className="text-accent underline underline-offset-2"
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
