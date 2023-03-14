import { useSession, getSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function GlobalReports() {
  const { data: session, status } = useSession();
  const router = useRouter();
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Access Denied</p>;
  }
  return (
    <div className="mx-auto flex max-w-6xl gap-4">
      <section>
        <h2>Global Reports</h2>
        <div className="flex gap-4">
          <Link href={router.asPath + "/logged"}>Logged</Link>
          <Link href={router.asPath + "/assigned"}>Assigned</Link>
          <Link href={router.asPath + "/available"}>Available</Link>
        </div>
        <div className="todo h-14">Global Reports</div>
      </section>
    </div>
  );
}
