"use client";

import NextTopLoader from "nextjs-toploader";
import { SessionProvider } from "next-auth/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TailwindIndicator } from "./tailwind-indicator";
import PHProvider from "./analytics";
import { ThemeProvider } from "./theme-provider";

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
          <SessionProvider>{children}</SessionProvider>
          <Toaster richColors />
        </ThemeProvider>
      </PHProvider>
      <TailwindIndicator />
    </>
  );
}
