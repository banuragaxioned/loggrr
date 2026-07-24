"use client";

import PHProvider from "./analytics";
import NextTopLoader from "nextjs-toploader";
import { TailwindIndicator } from "./tailwind-indicator";
import { ThemeProvider } from "./theme-provider";
import { ColorThemeProvider, useColorTheme } from "./color-theme-provider";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { useTheme } from "next-themes";

const TopLoader = () => {
  const { activeTheme } = useColorTheme();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Zinc dark mode inverts primary to near-white — use a readable loader color.
  const color =
    activeTheme.id === "zinc" && resolvedTheme === "dark" ? "#FAFAFA" : activeTheme.loader;

  return mounted && <NextTopLoader showSpinner={false} color={color} height={3} shadow={false} />;
};

export function ContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PHProvider>
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
          <ColorThemeProvider>
            <NuqsAdapter>
              <TopLoader />
              <TooltipProvider>
                <SessionProvider>{children}</SessionProvider>
              </TooltipProvider>
              <Toaster richColors />
            </NuqsAdapter>
          </ColorThemeProvider>
        </ThemeProvider>
      </PHProvider>
      <TailwindIndicator />
    </>
  );
}
