import { notFound } from "next/navigation";
import { getCurrentUser } from "@/server/session";
import { pageProps } from "@/types";

interface DashboardLayoutProps extends pageProps {
  children?: React.ReactNode;
}

export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const user = await getCurrentUser();

  if (!user) {
    return notFound();
  }

  return <div className="container">{children}</div>;
}
