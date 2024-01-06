import "./globals.css";
import { Metadata, Viewport } from "next";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Be_Vietnam_Pro as PrimaryFont } from "next/font/google";
import localFont from "next/font/local";
import { ContextProvider } from "./context-provider";
import { SiteHeader } from "./site-header";

const fontHeading = localFont({
  src: "../assets/fonts/CalSans-SemiBold.woff2",
  variable: "--font-heading",
});

const font = PrimaryFont({
  subsets: ["latin"],
  variable: "--font-primary",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen overscroll-y-none bg-background font-sans antialiased",
          font.variable,
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
