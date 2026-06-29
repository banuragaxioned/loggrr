import { Geist } from "next/font/google";
import localFont from "next/font/local";

import { cn } from "@/lib/utils";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const fontHeading = localFont({
  src: "../assets/fonts/CalSans-SemiBold.woff2",
  variable: "--font-heading",
  display: "block",
  weight: "600",
  preload: true,
});

export const fontVariables = cn(fontSans.variable, fontHeading.variable);
