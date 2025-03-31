"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@workspace/ui/components/sonner";
import { TRPCReactProvider } from "@/trpc/client";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TRPCReactProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme>
        <NuqsAdapter>
          {children}
          <ReactQueryDevtools />
          <Toaster />
        </NuqsAdapter>
      </NextThemesProvider>
    </TRPCReactProvider>
  );
}
