"use client";

import PHProvider from "./analytics";
import NextTopLoader from "nextjs-toploader";
import { TailwindIndicator } from "./tailwind-indicator";
import { ThemeProvider } from "./theme-provider";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";

const TopLoader = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    mounted && (
      <NextTopLoader showSpinner={false} color={theme === "dark" ? "#fff" : "#000"} height={3} shadow={false} />
    )
  );
};

export function ContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PHProvider>
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
          <TopLoader />
          <TooltipProvider>
            <SessionProvider>{children}</SessionProvider>
          </TooltipProvider>
          <Toaster richColors />
        </ThemeProvider>
      </PHProvider>
      <TailwindIndicator />
    </>
  );
}
