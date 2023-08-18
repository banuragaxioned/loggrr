import type { Metadata } from "next";
import { pageProps } from "@/types";

export const metadata: Metadata = {
  title:`Manage`
};

const Page = async ({ params }: pageProps) => {
  return <h3>Manage</h3>;
};

export default Page;
