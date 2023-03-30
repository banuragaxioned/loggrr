import Unavailable from "@/components/unavailable";
import { useValidateTenantAccess } from "@/hooks/useTenant";
import Link from "next/link";
import { useRouter } from "next/router";

export default function GlobalReports() {
  const { isLoading, isInvalid } = useValidateTenantAccess();
  const router = useRouter();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isInvalid) {
    return <Unavailable />;
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
