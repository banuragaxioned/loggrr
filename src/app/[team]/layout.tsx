import { notFound } from "next/navigation";
import { db } from "@/db";

import { getCurrentUser } from "@/lib/session";
import { pageProps } from "@/types";

interface DashboardLayoutProps extends pageProps {
  children?: React.ReactNode;
}

export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const user = await getCurrentUser();
  const team = params?.team;

  if (!user) {
    return notFound();
  }

  const hasAccess = await db.userRole.findMany({
    where: {
      Workspace: {
        slug: team,
        Users: {
          some: {
            id: user.id,
          },
        },
      },
      User: {
        id: user.id,
      },
    },
  });

  if (hasAccess && hasAccess.length !== 1) {
    return notFound();
  }

  return (
    <div className="container grid gap-12 md:grid-cols-1">
      <main className="flex w-full flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  );
}
