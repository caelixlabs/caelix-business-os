import { NextResponse, type NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/signup'];
const SESSION_FLAG_COOKIE = 'caelix_session';

/**
 * This is a UX redirect, not the security boundary — the cookie it
 * reads carries no token, just a boolean "was authenticated last we
 * knew" flag set by the auth store. Real authorization happens
 * server-side on every API request via the JWT. Its only job here is
 * avoiding the flash-of-login-page-then-redirect that a client-only
 * guard causes.
 */
export function middleware(request: NextRequest) {
  const hasSessionFlag = request.cookies.has(SESSION_FLAG_COOKIE);
  const { pathname } = request.nextUrl;
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  if (isPublicRoute) {
    if (hasSessionFlag) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (!hasSessionFlag) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|brand|icon-512.png|apple-touch-icon.png).*)'],
};
