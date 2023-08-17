import type { Metadata } from "next";
import { pageProps } from "@/types";
import { manageConfig } from "@/config/site";

export const metadata: Metadata = manageConfig.manage;

const Page = async ({ params }: pageProps) => {
  return <h3>Manage</h3>;
};

export default Page;
