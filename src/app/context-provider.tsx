"use client";

import { Toaster } from "react-hot-toast";
import PHProvider, { Analytics } from "./analytics";
import { TailwindIndicator } from "./tailwind-indicator";
import { ThemeProvider } from "./theme-provider";
import { SessionProvider } from "next-auth/react";
import { Toaster as Sonner } from "@/components/ui/sonner";

export function ContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PHProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div vaul-drawer-wrapper="">
            <SessionProvider>{children}</SessionProvider>
          </div>
        </ThemeProvider>
      </PHProvider>
      <Analytics />
      <Toaster />
      <Sonner />
      <TailwindIndicator />
    </>
  );
}
