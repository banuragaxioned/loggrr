import { Suspense } from "react";
import DashboardClient from "./dashboard-client";
import DashboardLoading from "./loading";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Search from "@/components/search";
import UserMenu from "@/components/user-menu";

export default function Dashboard() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <Suspense fallback={<DashboardLoading />}>
        <DashboardClient />
      </Suspense>
    </div>
  );
}
