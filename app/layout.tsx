import "./globals.css";
import { Metadata, Viewport } from "next";
import { siteConfig } from "@/config/site";
import { fontVariables } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { COLOR_THEME_IDS, COLOR_THEME_STORAGE_KEY, DEFAULT_COLOR_THEME } from "@/lib/color-themes";
import { CUSTOM_THEME_STORAGE_KEY, CUSTOM_THEME_STYLE_ID } from "@/lib/generate-theme";
import { ContextProvider } from "./context-provider";
import { SiteHeader } from "./site-header";
import { getAllProjects } from "@/server/services/project";
import { getCurrentUser } from "@/server/session";
import FacebookRedirect from "@/components/user-agent";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["Loggrr", "Time-tracking", "Productivity", "Time", "Billing"],
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

const colorThemeInitScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(COLOR_THEME_STORAGE_KEY)});var v=${JSON.stringify([...COLOR_THEME_IDS])};var theme=v.indexOf(t)>=0?t:${JSON.stringify(DEFAULT_COLOR_THEME)};document.documentElement.dataset.theme=theme;if(theme==="custom"){var css=localStorage.getItem(${JSON.stringify(`${CUSTOM_THEME_STORAGE_KEY}-css`)});if(css){var s=document.getElementById(${JSON.stringify(CUSTOM_THEME_STYLE_ID)});if(!s){s=document.createElement("style");s.id=${JSON.stringify(CUSTOM_THEME_STYLE_ID)};document.head.appendChild(s);}s.textContent=css;}}}catch(e){document.documentElement.dataset.theme=${JSON.stringify(DEFAULT_COLOR_THEME)};}})();`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  const projects = await getAllProjects(user?.id);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <script dangerouslySetInnerHTML={{ __html: colorThemeInitScript }} />
      </head>
      <body
        className={cn(
          "min-h-screen items-center overscroll-y-none bg-background font-sans text-base antialiased",
          fontVariables,
        )}
      >
        <ContextProvider>
          <SiteHeader projects={projects} />
          {children}
        </ContextProvider>
        <FacebookRedirect />
      </body>
    </html>
  );
}
