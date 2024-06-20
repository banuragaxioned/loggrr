import { notFound } from "next/navigation";
import { getCurrentUser } from "@/server/session";

interface DashboardLayoutProps {
  children?: React.ReactNode;
  params: string;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await getCurrentUser();

  if (!user) {
    return notFound();
  }

  return (
    <div className="container grid gap-12 md:grid-cols-1">
      <main className="flex w-full flex-1 flex-col">{children}</main>
    </div>
  );
}
