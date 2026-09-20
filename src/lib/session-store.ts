import { cookies } from 'next/headers';

import {
  ACCESS_TOKEN_COOKIE,
  COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE,
  decodeAccessToken,
  type AccessTokenPayload,
  type Tokens,
} from './session';

export const setSession = async ({ accessToken, refreshToken }: Tokens) => {
  const store = await cookies();

  store.set(ACCESS_TOKEN_COOKIE, accessToken, COOKIE_OPTIONS);
  store.set(REFRESH_TOKEN_COOKIE, refreshToken, COOKIE_OPTIONS);
};

export const clearSession = async () => {
  const store = await cookies();

  store.delete(ACCESS_TOKEN_COOKIE);
  store.delete(REFRESH_TOKEN_COOKIE);
};

export const getAccessToken = async () => {
  const store = await cookies();

  return store.get(ACCESS_TOKEN_COOKIE)?.value;
};

export const getRefreshToken = async () => {
  const store = await cookies();

  return store.get(REFRESH_TOKEN_COOKIE)?.value;
};

export const getCurrentUser = async (): Promise<AccessTokenPayload | null> => {
  const token = await getAccessToken();

  return token ? decodeAccessToken(token) : null;
};
