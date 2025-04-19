import { Suspense } from "react";
import DashboardClient from "./dashboard-client";
import DashboardLoading from "./loading";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Search from "@/components/search";
import UserMenu from "@/components/user-menu";

export default function Dashboard() {
  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-2">
        <div className="flex flex-1 items-center gap-2 px-3">
          <SidebarTrigger />
          <Search className="flex-1 max-w-md" />
        </div>
        <div className="ml-auto px-3">
          <UserMenu />
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <Suspense fallback={<DashboardLoading />}>
          <DashboardClient />
        </Suspense>
      </div>
    </>
  );
}
