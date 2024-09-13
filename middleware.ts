import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { JWT } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = (await getToken({ req: request, secret: process.env.SECRET })) as JWT;

  if (!token) return NextResponse.redirect(new URL('/authentication/signin', request.url));

  // Allow access to /blank for all roles

  // Check the role and redirect based on the role
  switch (token.role) {
    case 'RECEPTIONIST':
      if (!request.nextUrl.pathname.startsWith('/profile')) {
        return NextResponse.redirect(new URL('/profile', request.url));
      }
      break;
    case 'DOCTOR':
      if (
        !request.nextUrl.pathname.startsWith('/patients') &&
        !request.nextUrl.pathname.startsWith('/patientprofile') &&
        !request.nextUrl.pathname.startsWith('/complain') &&
        !request.nextUrl.pathname.startsWith('/report')
      ) {
        return NextResponse.redirect(new URL('/patients', request.url));
      }
      break;
    case 'NURSE':
      // Add the paths that the nurse can access here
      if (!request.nextUrl.pathname.startsWith('/vitals')) {
        return NextResponse.redirect(new URL('/vitals', request.url));
      }
      break;
    case 'PATHOLOGIST':
      // Add the paths that the pathologist can access here
      if (!request.nextUrl.pathname.startsWith('/image')) {
        return NextResponse.redirect(new URL('/image', request.url));
      }
      break;
    case 'viewer':
      // Add the paths that the nurse can access here
      if (!request.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/dashboard/default', request.url));
      }
      break;
    default:
      return NextResponse.redirect(new URL('/authentication/signin', request.url));
  }
}

export const config = {
  matcher: [
    // Match all routes except the ones that start with /api, _next/static, _next/image, favicon.ico, and authentication routes
    '/((?!api|_next/static|_next/image|favicon.ico|authentication/signin|authentication/signup).*)',
  ],
};
