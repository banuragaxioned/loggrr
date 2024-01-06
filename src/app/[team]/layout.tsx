import { notFound } from "next/navigation";
import { prisma } from "@/server/db";

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

  const hasAccess = await prisma.userRole.findMany({
    where: {
      Tenant: {
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
    <div>
      <main className="container flex w-full flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  );
}
