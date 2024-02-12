"use client";

import PHProvider, { Analytics } from "./analytics";
import { TailwindIndicator } from "./tailwind-indicator";
import { ThemeProvider } from "./theme-provider";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { MenuProvider } from "./menu-context";

export function ContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PHProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <SessionProvider>
            <MenuProvider>{children}</MenuProvider>
          </SessionProvider>
          <Toaster richColors />
        </ThemeProvider>
      </PHProvider>
      <Analytics />
      <TailwindIndicator />
    </>
  );
}
