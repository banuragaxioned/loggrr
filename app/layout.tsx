import "./globals.css";
import { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { siteConfig } from "@/config/site";
import { fontVariables } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { ContextProvider } from "./context-provider";
import { AppShell } from "@/components/app-shell";
import { getAllProjects } from "@/server/services/project";
import { getCurrentSession } from "@/server/session";
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentSession();
  const projects = await getAllProjects(session?.user?.id);
  const cookieStore = await cookies();
  const defaultSidebarOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body
        className={cn(
          "min-h-screen items-center overscroll-y-none bg-background font-sans text-base antialiased",
          fontVariables,
        )}
      >
        <ContextProvider session={session}>
          <AppShell projects={projects} defaultSidebarOpen={defaultSidebarOpen}>
            {children}
          </AppShell>
        </ContextProvider>
        <FacebookRedirect />
      </body>
    </html>
  );
}
