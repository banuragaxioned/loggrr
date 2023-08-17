import type { Metadata } from "next";
import { pageProps } from "@/types";
import { reportConfig } from "@/config/site";

export const metadata: Metadata = reportConfig.logged;

export default async function Page({ params }: pageProps) {
  return (
    <>
      <h3>Coming soon</h3>
    </>
  );
}
