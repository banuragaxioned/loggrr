import { Be_Vietnam_Pro as PrimaryFont } from "next/font/google";

import "@/styles/globals.css";
import { TailwindIndicator } from "@/components/tailwind-indicator";

import { cn } from "@/lib/helper";

const font = PrimaryFont({
  subsets: ["latin"],
  variable: "--font-bevietnampro",
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
  title: "Home",
  description: "Welcome to Next.js",
};
