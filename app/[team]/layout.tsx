import { notFound } from "next/navigation";
import { getCurrentUser } from "@/server/session";
import { pageProps } from "@/types";
import { isMember } from "@/server/services/members";

interface DashboardLayoutProps extends pageProps {
  children?: React.ReactNode;
}

export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const user = await getCurrentUser();
  const slug = decodeURIComponent(params.team);

  if (!user) {
    return notFound();
  }

  const isMemberFound = await isMember(slug, user.id);

  if (!isMemberFound) {
    return notFound();
  }

  return (
    <div className="container grid gap-12 md:grid-cols-1">
      <main>{children}</main>
    </div>
  );
}
