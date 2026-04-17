import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/profile(.*)', '/checkout(.*)']);
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // 1. Protect User Routes
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // 2. Protect Admin Perimeter
  if (isAdminRoute(req)) {
    const session = await auth();

    // Check if the user is signed in first
    if (!session.userId) {
      return session.redirectToSignIn();
    }

    // Role check logic
    const role = (session.sessionClaims?.metadata as any)?.role;
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};