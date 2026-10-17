import Link from "next/link";

import { Brand } from "@/components";

import { RegisterForm } from "./ui/RegisterForm";

interface Props {
  searchParams: Promise<{ redirectTo?: string }>;
}

export default async function RegisterPage({ searchParams }: Props) {
  const { redirectTo } = await searchParams;
  const back = redirectTo
    ? `?redirectTo=${encodeURIComponent(redirectTo)}`
    : "";

  return (
    <main className="grid min-h-screen place-items-center px-4 py-12">
      <div className="w-full max-w-sm">
        <Brand />

        <p className="kicker mt-7 text-accent">Your next stay</p>
        <h1 className="mt-1 mb-7 text-3xl">Create an account</h1>

        <RegisterForm redirectTo={redirectTo ?? "/"} />

        <p className="mt-5 text-sm text-muted">
          Already have an account?{" "}
          <Link
            href={`/auth/login${back}`}
            className="text-accent underline underline-offset-2"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
