import { Be_Vietnam_Pro as PrimaryFont } from "next/font/google";
import localFont from "next/font/local";

import "@/styles/globals.css";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { siteConfig } from "@/config/site";
import { ThemeProvider } from "@/components/theme-provider";
import PHProvider, { Analytics } from "@/components/analytics";
import { Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Metadata } from "next";

// Font files can be colocated inside of `pages`
const fontHeading = localFont({
  src: "../assets/fonts/CalSans-SemiBold.woff2",
  variable: "--font-heading",
});

const font = PrimaryFont({
  subsets: ["latin"],
  variable: "--font-primary",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: [{
    rel: "icon", url: "favicon.svg", type:"image/svg+xml", sizes:"any"
  }]
};
