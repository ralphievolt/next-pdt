import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { JWT } from 'next-auth/jwt';

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const token = (await getToken({ req: request, secret: process.env.SECRET })) as JWT | null;

  if (!token) return NextResponse.redirect(new URL('/authentication/signin', request.url));
  
  // Check the role and redirect based on the role
  switch (token.role) {
    case 'admin':
      // Admin has access to all routes, so no redirection needed
      break;
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
      if (!request.nextUrl.pathname.startsWith('/vitals')) {
        return NextResponse.redirect(new URL('/vitals', request.url));
      }
      break;
    case 'PATHOLOGIST':
      if (!request.nextUrl.pathname.startsWith('/image')) {
        return NextResponse.redirect(new URL('/image', request.url));
      }
      break;
    case 'viewer':
      if (!request.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/dashboard/default', request.url));
      }
      break;
    default:
      return NextResponse.redirect(new URL('/authentication/signin', request.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    // Match all routes except the ones that start with /api, _next/static, _next/image, favicon.ico, and authentication routes
    '/((?!api|_next/static|_next/image|favicon.ico|authentication/signin|authentication/signup|authentication/change-password).*)',
  ],
};
