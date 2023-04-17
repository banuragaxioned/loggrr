import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/session";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await getCurrentUser();

  if (!user) {
    return notFound();
  }

  return (
    <>
      <div className="container grid gap-12 md:grid-cols-[200px_1fr]">{children}</div>
    </>
  );
}
