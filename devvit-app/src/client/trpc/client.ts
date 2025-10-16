import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../server';

export const trpc: ReturnType<typeof createTRPCReact<AppRouter>> = createTRPCReact<AppRouter>();

// Get the tRPC API URL
// IMPORTANT: Devvit requires all client-side fetch requests to:
// 1. Stay on the same domain (webview domain)
// 2. Use endpoints that end with /api
function getServerUrl(): string {
  const url = '/api/trpc';
  console.log('[tRPC Client] Using API URL:', url);
  return url;
}

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: getServerUrl(),
      fetch(url, options) {
        console.log('[tRPC Client] Fetching:', url, options);
        return fetch(url, options as RequestInit);
      },
    }),
  ],
});
