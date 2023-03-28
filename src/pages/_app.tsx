import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/react";
import { Be_Vietnam_Pro } from "next/font/google";
import { ThemeProvider } from "next-themes";

// If loading a variable font, you don't need to specify the font weight
const font = Be_Vietnam_Pro({
  subsets: ["latin"],
  variable: "--font-bevietnampro",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
import { api } from "@/utils/api";

import "@/styles/globals.css";
import { Layout } from "@/components/layout";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${font.style.fontFamily};
        }
      `}</style>
      <SessionProvider session={session}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>

        <Analytics />
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
