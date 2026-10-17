"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { register as createAccount } from "@/actions";
import { Field, fieldClass } from "@/components";
import { registerSchema, type RegisterInput } from "@/schemas";

interface Props {
  redirectTo: string;
}

export const RegisterForm = ({ redirectTo }: Props) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", password: "" },
  });

  const onSubmit = (data: RegisterInput) => {
    setServerError(null);

    startTransition(async () => {
      const result = await createAccount(data, redirectTo);

      if (result?.message) {
        setServerError(result.message);
      }
    });
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <Field label="Full name" error={errors.fullName?.message}>
        <input
          {...register("fullName")}
          type="text"
          autoComplete="name"
          className={fieldClass(!!errors.fullName)}
        />
      </Field>

      <Field label="Email" error={errors.email?.message}>
        <input
          {...register("email")}
          type="email"
          autoComplete="email"
          className={fieldClass(!!errors.email)}
        />
      </Field>

      <Field
        label="Password"
        hint="At least 8 characters"
        error={errors.password?.message}
      >
        <input
          {...register("password")}
          type="password"
          autoComplete="new-password"
          className={fieldClass(!!errors.password)}
        />
      </Field>

      {serverError && (
        <p className="rounded border border-danger/25 bg-danger-tint px-3 py-2 text-sm text-danger">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 rounded bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-deep disabled:opacity-45"
      >
        {pending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
};
