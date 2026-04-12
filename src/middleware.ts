import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// ONLY protect the /profile dashboard right now, so that users can 
// freely browse the /search and /property pages without being forced to login.
const isProtectedRoute = createRouteMatcher([
  '/profile(.*)',
  '/checkout(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
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
