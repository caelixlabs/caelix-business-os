import { NextResponse, type NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/signup'];
const SESSION_FLAG_COOKIE = 'caelix_session';

/**
 * UX redirect gate only. The cookie contains no token or user data;
 * authentication and authorization remain enforced by the API using JWTs.
 */
export function proxy(request: NextRequest) {
  const hasSessionFlag = request.cookies.has(SESSION_FLAG_COOKIE);
  const { pathname } = request.nextUrl;
  // Signing links are opened by people with no account, and by staff who may already be signed in.
  if (pathname.startsWith('/sign/')) return NextResponse.next();

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
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|brand|icon-512.png|apple-touch-icon.png).*)',
  ],
};
