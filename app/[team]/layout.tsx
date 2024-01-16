import { notFound } from "next/navigation";
import { db } from "@/server/db";

import { getCurrentUser } from "@/server/session";
import { pageProps } from "@/types";

interface DashboardLayoutProps extends pageProps {
  children?: React.ReactNode;
}

export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const user = await getCurrentUser();
  const slug = decodeURIComponent(params.team);

  if (!user) {
    return notFound();
  }

  const hasAccess = await db.userWorkspace.findMany({
    where: {
      workspace: {
        slug: slug,
      },
      user: {
        id: user.id,
      },
    },
  });

  if (hasAccess && hasAccess.length !== 1) {
    return notFound();
  }

  return (
    <div className="container grid gap-12 md:grid-cols-1">
      <main>{children}</main>
    </div>
  );
}
