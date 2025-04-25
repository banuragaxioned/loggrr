import { Suspense } from "react";
import DashboardClient from "./dashboard-client";
import DashboardLoading from "./loading";

export default function Dashboard() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <Suspense fallback={<DashboardLoading />}>
        <DashboardClient />
      </Suspense>
    </div>
  );
}
