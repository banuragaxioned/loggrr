import { notFound } from "next/navigation";
import { Metadata } from "next";

import { getCurrentUser } from "@/server/session";
import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "./side-nav";

export const metadata: Metadata = {
  title: "Manage",
  description: "Manage your account and settings.",
};

interface ManageLayoutProps {
  children?: React.ReactNode;
}

export default async function ManageLayout({ children }: ManageLayoutProps) {
  const user = await getCurrentUser();

  if (!user) {
    return notFound();
  }

  const sidebarNavItems = [
    {
      title: "Profile",
      href: "/manage",
    },
    {
      title: "Notifications",
      href: "/manage/notifications",
    },
  ];

  return (
    <div className="container grid gap-12 md:grid-cols-1">
      <div className="mb-8">
        <div className="space-y-1 p-2">
          <h1>Settings</h1>
          <p>Manage your account settings and profiles</p>
        </div>
        <div className="px-2">
          <Separator className="my-2" />
          <div className="mt-4 flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="lg:w-1/5">
              <SidebarNav items={sidebarNavItems} />
            </aside>
            <div className="flex-1 lg:max-w-2xl">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
