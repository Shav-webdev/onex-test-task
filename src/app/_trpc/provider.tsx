'use client';

import { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { httpBatchStreamLink } from '@trpc/client';
import superjson from 'superjson';
import { trpc } from '@/shared/api/trpc-react';
import { makeQueryClient } from '@/shared/api/query-client';

let clientQueryClientSingleton: ReturnType<typeof makeQueryClient> | undefined = undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Always create a new client on the server to avoid cross-request cache sharing
    return makeQueryClient();
  }
  return (clientQueryClientSingleton ??= makeQueryClient());
}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchStreamLink({
          url: '/api/trpc',
          transformer: superjson,
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </trpc.Provider>
  );
}
