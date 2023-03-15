import Link from "next/link";
import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import Unavailable from "@/components/unavailable";

import { api } from "../utils/api";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: getTenantDetailsData } = api.tenant.getTenantDetails.useQuery(
    undefined, // no input
    { enabled: session?.user !== undefined }
  );
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (
    status === "unauthenticated" ||
    getTenantDetailsData?.slug !== router.asPath.slice(1)
  ) {
    return <Unavailable />;
  }
  return (
    <div className="mx-auto flex max-w-6xl gap-4">
      <section className="lg:basis-3/4">
        <div className="flex gap-4">
          <Link href={router.asPath + "/projects"}>Project List</Link>
          <Link href={router.asPath + "/members"}>Members</Link>
          <Link href={router.asPath + "/assign"}>Assign</Link>
          <Link href={router.asPath + "/reports"}>Reports</Link>
          <Link href={router.asPath + "/billing"}>Billing</Link>
          <Link href={router.asPath + "/settings"}>Settings</Link>
        </div>
        <div className="todo h-14">Calendar</div>
        <div className="todo h-20">Add Time Combobox</div>
        <span className="todo h-80">
          <p>Logged time entries come here</p>
        </span>
      </section>
      <section className="hidden lg:block lg:basis-1/4">
        <span className="todo h-full">
          <p>Sidebar</p>
        </span>
      </section>
    </div>
  );
}
