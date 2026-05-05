import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const handleI18n = createMiddleware(routing);

const PROTECTED = ['dashboard', 'account', 'admin', 'educator-dashboard'];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split('/').filter(Boolean);
  const pathSegments = segments.slice(1);
  const isProtected = pathSegments.some((s) => PROTECTED.includes(s));
  const hasToken = !!request.cookies.get('auth_token');

  if (isProtected && !hasToken) {
    const locale = segments[0] || 'ru';
    const loginUrl = new URL(`/${locale}/auth/login`, request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return handleI18n(request);
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
};
