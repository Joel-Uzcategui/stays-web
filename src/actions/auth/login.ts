'use server';

import { redirect } from 'next/navigation';

import { apiFetch, errorMessage } from '@/lib/api';
import { setSession } from '@/lib/session-store';
import { loginSchema, type LoginInput } from '@/schemas';

interface LoginState {
  message?: string;
}

export const login = async (
  input: LoginInput,
  redirectTo: string,
): Promise<LoginState | void> => {
  const parsed = loginSchema.safeParse(input);

  if (!parsed.success) {
    return { message: parsed.error.issues[0].message };
  }

  const response = await apiFetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsed.data),
  }).catch(() => null);

  if (!response) {
    return { message: 'The API is not reachable' };
  }

  if (!response.ok) {
    return { message: await errorMessage(response, 'Could not sign in') };
  }

  const session = await response.json();

  await setSession(session);

  redirect(session.user.role === 'admin' ? redirectTo : '/');
};
