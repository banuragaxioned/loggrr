"use client";
// ^-- to make sure we can mount the Provider from a server component

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import React, { useState } from "react";
import { createTRPCContext } from "@trpc/tanstack-react-query";

const { TRPCProvider: TRPCProviderBase } = createTRPCContext();

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    createTRPCClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
        }),
      ],
    }),
  );

  return (
    <TRPCProviderBase trpcClient={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </TRPCProviderBase>
  );
}
