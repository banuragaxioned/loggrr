import "./globals.css";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import localFont from "next/font/local";
import { GeistSans } from "geist/font/sans";
import { ContextProvider } from "./context-provider";
import { SiteHeader } from "./site-header";

const fontHeading = localFont({
  src: "../assets/fonts/CalSans-SemiBold.woff2",
  variable: "--font-heading",
});

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen items-center overscroll-y-none border-border font-sans text-base antialiased",
          `${GeistSans.variable}`,
          fontHeading.variable,
        )}
      >
        <ContextProvider>
          <SiteHeader />
          {children}
        </ContextProvider>
      </body>
    </html>
  );
}
