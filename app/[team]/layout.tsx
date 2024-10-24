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

  if (isMemberFound && isMemberFound.role === "INACTIVE") {
    return (
      <div className="container flex min-h-[calc(100vh-100px)] items-center text-center">
        <div className="w-full">
          Your account is currently inactive. Please contact the administrator for assistance.
        </div>
      </div>
    );
  }

  return <div className="container">{children}</div>;
}
