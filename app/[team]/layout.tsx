import { notFound } from "next/navigation";
import { getCurrentUser } from "@/server/session";
import { pageProps } from "@/types";
import { IsMember } from "@/server/services/members";

interface DashboardLayoutProps extends pageProps {
  children?: React.ReactNode;
}

export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const user = await getCurrentUser();
  const slug = decodeURIComponent(params.team);

  if (!user) {
    return notFound();
  }

  const isMember = await IsMember(slug, user.id);

  if (!isMember) {
    return notFound();
  }

  return (
    <div className="container grid gap-12 md:grid-cols-1">
      <main>{children}</main>
    </div>
  );
}
