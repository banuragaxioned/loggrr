import { Be_Vietnam_Pro as PrimaryFont } from "next/font/google";

import "@/styles/globals.css";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { siteConfig } from "@/config/site";

import { cn } from "@/lib/helper";

const font = PrimaryFont({
  subsets: ["latin"],
  variable: "--font-font",
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
      <body>
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    //   images: [
    //     {
    //       url: absoluteUrl("/og.jpg"),
    //       width: 1200,
    //       height: 630,
    //       alt: siteConfig.name,
    //     },
    //   ],
    // },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.name,
      description: siteConfig.description,
      // images: [`${siteConfig.url}/og.jpg`],
      creator: "@TeamAxioned",
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png",
    },
    manifest: `${siteConfig.url}/site.webmanifest`,
  },
};
