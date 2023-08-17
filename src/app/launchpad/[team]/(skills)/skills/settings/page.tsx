import type { Metadata } from "next";
import { pageProps } from "@/types";
import { skillConfig } from "@/config/site";

export const metadata: Metadata = skillConfig.setting;
export default async function Page({ params }: pageProps) {
  return (
    <>
      <h3>Coming soon</h3>
    </>
  );
}
