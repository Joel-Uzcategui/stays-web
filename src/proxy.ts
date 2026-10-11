import { NextResponse, type NextRequest } from 'next/server';

import {
  ACCESS_TOKEN_COOKIE,
  COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE,
  decodeAccessToken,
  isExpired,
  requestRefresh,
  type AccessTokenPayload,
  type Tokens,
} from '@/lib/session';

const signOut = (request: NextRequest) => {
  const url = new URL('/auth/login', request.url);
  url.searchParams.set('redirectTo', request.nextUrl.pathname);

  const response = NextResponse.redirect(url);
  response.cookies.delete(ACCESS_TOKEN_COOKIE);
  response.cookies.delete(REFRESH_TOKEN_COOKIE);

  return response;
};

const allow = (request: NextRequest, tokens?: Tokens) => {
  if (!tokens) {
    return NextResponse.next();
  }

  request.cookies.set(ACCESS_TOKEN_COOKIE, tokens.accessToken);
  request.cookies.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken);

  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  response.cookies.set(ACCESS_TOKEN_COOKIE, tokens.accessToken, COOKIE_OPTIONS);
  response.cookies.set(
    REFRESH_TOKEN_COOKIE,
    tokens.refreshToken,
    COOKIE_OPTIONS,
  );

  return response;
};

const forbidden = (
  request: NextRequest,
  payload: AccessTokenPayload | null,
) => {
  const adminArea = request.nextUrl.pathname.startsWith('/admin');

  return adminArea && payload?.role !== 'admin';
};

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const payload = accessToken ? decodeAccessToken(accessToken) : null;

  if (payload && !isExpired(payload)) {
    return forbidden(request, payload)
      ? NextResponse.redirect(new URL('/', request.url))
      : allow(request);
  }

  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!refreshToken) {
    return signOut(request);
  }

  const tokens = await requestRefresh(refreshToken);

  if (!tokens) {
    return signOut(request);
  }

  const refreshed = decodeAccessToken(tokens.accessToken);

  if (forbidden(request, refreshed)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return allow(request, tokens);
}

export const config = {
  matcher: ['/admin/:path*', '/me/:path*', '/bookings/:path*'],
};
