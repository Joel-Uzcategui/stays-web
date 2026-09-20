export const ACCESS_TOKEN_COOKIE = 'accessToken';
export const REFRESH_TOKEN_COOKIE = 'refreshToken';

export const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
} as const;

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export const decodeAccessToken = (
  token: string,
): AccessTokenPayload | null => {
  const encoded = token.split('.')[1];

  if (!encoded) {
    return null;
  }

  try {
    return JSON.parse(atob(encoded.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
};

export const isExpired = ({ exp }: AccessTokenPayload, skewSeconds = 30) =>
  exp * 1000 <= Date.now() + skewSeconds * 1000;

export const requestRefresh = async (
  refreshToken: string,
): Promise<Tokens | null> => {
  const response = await fetch(`${process.env.API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
    cache: 'no-store',
  }).catch(() => null);

  if (!response?.ok) {
    return null;
  }

  return response.json();
};
