import { auth } from '@/lib/auth';

export default auth((req) => {
  // Add any additional middleware logic here
  const { pathname } = req.nextUrl;

  // Check if user is authenticated for protected routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/wizard')) {
    if (!req.auth) {
      const signInUrl = new URL('/auth/signin', req.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return Response.redirect(signInUrl);
    }
  }
});

export const config = {
  matcher: ['/dashboard/:path*', '/wizard/:path*'],
};
