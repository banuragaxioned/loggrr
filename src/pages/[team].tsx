import Link from "next/link";
import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { pid } = router.query;
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Access Denied</p>;
  }
  return (
    <div className="mx-auto flex max-w-6xl gap-4">
      <section className="lg:basis-3/4">
        <div className="flex gap-4">
          <Link href="/tenant/settings">Settings</Link>
          <Link href="/tenant/projects">Project List</Link>
          <Link href="/tenant/billing">Billing</Link>
          <Link href="/tenant/members">Members</Link>
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
