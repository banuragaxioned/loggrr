import { TailwindIndicator } from "@/app/tailwind-indicator";
import { siteConfig } from "@/config/site";
import { ThemeProvider } from "@/app/theme-provider";
import PHProvider, { Analytics } from "@/app/analytics";
import { Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Metadata } from "next";

import { Be_Vietnam_Pro as PrimaryFont } from "next/font/google";
import localFont from "next/font/local";
import "@/styles/globals.css";

const fontHeading = localFont({
  src: "../assets/fonts/CalSans-SemiBold.woff2",
  variable: "--font-heading",
});

const font = PrimaryFont({
  subsets: ["latin"],
  variable: "--font-primary",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen items-center border-border bg-background font-sans text-base text-foreground antialiased",
          font.variable,
          fontHeading.variable,
        )}
      >
        <PHProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
          <Analytics />
          <TailwindIndicator />
          <Toaster />
        </PHProvider>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["Loggr", "Time-tracking", "Productivity", "Time", "Billing"],
  authors: [
    {
      name: "Axioned",
      url: "https://axioned.com",
    },
  ],
  creator: "Axioned",
  icons: [
    {
      rel: "icon",
      url: "favicon.svg",
      type: "image/svg+xml",
      sizes: "any",
    },
  ],
};
