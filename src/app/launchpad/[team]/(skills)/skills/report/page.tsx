import type { Metadata } from "next";
import { pageProps } from "@/types";

export const metadata: Metadata = {
  title: `Report`,
};

export default async function Page({ params }: pageProps) {
  return (
    <>
      <h3>Coming soon</h3>
    </>
  );
}
