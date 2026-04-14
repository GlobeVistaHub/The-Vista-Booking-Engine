import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

import { NextResponse } from 'next/server';

// ONLY protect the /profile dashboard right now, so that users can 
// freely browse the /search and /property pages without being forced to login.
const isProtectedRoute = createRouteMatcher([
  '/profile(.*)',
  '/checkout(.*)'
]);

// Define the Admin perimeter
const isAdminRoute = createRouteMatcher([
  '/admin(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  // 1. Standard protection for guests (Redirects to login if not signed in)
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // 2. Strict Security Perimeter for the Host Dashboard
  if (isAdminRoute(req)) {
    // Force them to log in first if they haven't
    await auth.protect();

    const { sessionClaims } = await auth();
    
    // We check if their Clerk metadata has the "admin" role
    const role = (sessionClaims?.metadata as any)?.role;
    
    if (role !== 'admin') {
      // Intruder is logged in, but is NOT the host. Send them to the lobby.
      const url = new URL('/', req.url);
      return NextResponse.redirect(url);
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
