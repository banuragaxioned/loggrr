"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@workspace/ui/components/sonner";
import { TRPCProvider } from "@/trpc/client";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TRPCProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme>
        <NuqsAdapter>
          <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools />
            <Toaster />
          </QueryClientProvider>
        </NuqsAdapter>
      </NextThemesProvider>
    </TRPCProvider>
  );
}
