import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  ignoreErrors: [
    "THREE.WebGLRenderer: Error creating WebGL context.",
    "Error creating WebGL context.",
    "network error",
    "Failed to fetch",
    "NetworkError when attempting to fetch resource.",
    "Load failed",
    "ResizeObserver loop limit exceeded",
    "ResizeObserver loop completed with undelivered notifications",
    "The operation was aborted",
    "AbortError",
  ],
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
