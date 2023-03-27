import Link from "next/link";
import Unavailable from "@/components/unavailable";
import { useValidateTenantAccess } from "@/hooks/tenantValidation";
import { useRouter } from "next/router";
import { QuickStatsWidget } from "@/components/quickStats";
import CreateClient from "@/components/createClient";

export default function Dashboard() {
  const router = useRouter();
  const { isLoading, isInvalid } = useValidateTenantAccess();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isInvalid) {
    return <Unavailable />;
  }

  return (
    <div className="mx-auto flex max-w-6xl gap-4">
      <section className="lg:basis-3/4">
        <div className="flex gap-4">
          <Link href={router.asPath + "/projects"}>Project List</Link>
          <Link href={router.asPath + "/members"}>Members</Link>
          <Link href={router.asPath + "/skills"}>Skills</Link>
          <Link href={router.asPath + "/assign"}>Assign</Link>
          <Link href={router.asPath + "/reports"}>Reports</Link>
          <Link href={router.asPath + "/billing"}>Billing</Link>
          <Link href={router.asPath + "/settings"}>Settings</Link>
        </div>
        <CreateClient />
        <div className="flex gap-4"></div>
        <div className="todo h-14">Calendar</div>
        <div className="todo h-20">Add Time Combobox</div>
        <span className="todo h-80">
          <p>Logged time entries come here</p>
        </span>
      </section>
      <section className="hidden lg:block lg:basis-1/4">
        <QuickStatsWidget />
      </section>
    </div>
  );
}
