import { redirect } from 'next/navigation';

import { getAccessToken } from './session-store';

export const apiFetch = (path: string, init: RequestInit = {}) =>
  fetch(`${process.env.API_URL}${path}`, { cache: 'no-store', ...init });

export const authFetch = async (path: string, init: RequestInit = {}) => {
  const token = await getAccessToken();

  return apiFetch(path, {
    ...init,
    headers: {
      ...init.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};

export const requireSession = (response: Response) => {
  if (response.status === 401) {
    redirect('/auth/login');
  }
};

export const errorMessage = async (response: Response, fallback: string) => {
  const body = await response.json().catch(() => null);
  const message = body?.message;

  if (Array.isArray(message)) {
    return message.join('. ');
  }

  return typeof message === 'string' ? message : fallback;
};
