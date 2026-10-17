"use server";

import { redirect } from "next/navigation";

import { apiFetch, errorMessage } from "@/lib/api";
import { safePath } from "@/lib/redirect";
import { setSession } from "@/lib/session-store";
import { registerSchema, type RegisterInput } from "@/schemas";

interface RegisterState {
  message?: string;
}

export const register = async (
  input: RegisterInput,
  redirectTo: string,
): Promise<RegisterState | void> => {
  const parsed = registerSchema.safeParse(input);

  if (!parsed.success) {
    return { message: parsed.error.issues[0].message };
  }

  const response = await apiFetch("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  }).catch(() => null);

  if (!response) {
    return { message: "The API is not reachable" };
  }

  if (!response.ok) {
    return {
      message: await errorMessage(response, "Could not create the account"),
    };
  }

  const session = await response.json();

  await setSession(session);

  redirect(safePath(redirectTo, "/"));
};
