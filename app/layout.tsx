import "./globals.css";
import { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { GeistSans } from "geist/font/sans";
import NextTopLoader from "nextjs-toploader";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { ContextProvider } from "./context-provider";
import { SiteHeader } from "./site-header";
import { getAllProjects } from "@/server/services/project";
import { getCurrentUser } from "@/server/session";
import { notFound } from "next/navigation";

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
      url: "/favicon.svg",
      type: "image/svg+xml",
      sizes: "any",
    },
  ],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    return notFound();
  }

  const projects = await getAllProjects(user.id);

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen items-center overscroll-y-none bg-background font-sans text-base antialiased",
          `${GeistSans.variable}`,
          fontHeading.variable,
        )}
      >
        <ContextProvider>
          {/* TODO: Add theme color from theme config */}
          <NextTopLoader showSpinner={false} color="#000000" height={3} shadow={false} />
          <SiteHeader projects={projects} />
          {children}
        </ContextProvider>
      </body>
    </html>
  );
}
