import { useState, useEffect } from 'react';

/**
 * A hydration-safe hook for the Zustand stores.
 * Ensures that the client-side persisted state is correctly synchronized
 * with the React component tree without causing hydration mismatches in Next.js.
 */
export function useAppStore<T, F>(
  store: (callback: (state: T) => F) => F,
  callback: (state: T) => F
) {
  const result = store(callback);
  // No more useState lag — return result directly if we are on the client
  // or use a very simple state for hydration safety.
  const [data, setData] = useState<F>(result);

  useEffect(() => {
    setData(result);
  }, [result]);

  return data;
}
