import { Be_Vietnam_Pro as PrimaryFont } from "next/font/google";

import "@/styles/globals.css";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { siteConfig } from "@/config/site";

import { cn } from "@/lib/helper";

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
    <html lang="en" className={cn(font.variable)}>
      <body className="min-h-screen items-center border-zinc-300 bg-white text-base text-zinc-950 antialiased dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50">
        {children}
        <TailwindIndicator />
      </body>
    </html>
  );
}

export const metadata = {
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
};
