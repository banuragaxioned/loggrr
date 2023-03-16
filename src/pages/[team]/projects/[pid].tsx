import Unavailable from "@/components/unavailable";
import { useValidateTenantAccess } from "@/hooks/tenantValidation";
import { useSession, getSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Project() {
  const router = useRouter();
  const { pid } = router.query;
  const { isLoading, isInvalid } = useValidateTenantAccess();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isInvalid) {
    return <Unavailable />;
  }
  return (
    <div className="mx-auto flex max-w-6xl gap-4">
      <section>
        <h2>Project {pid}</h2>
        <Link href={router.asPath + "/manage"}>Manage</Link>
        <div className="todo h-14">Project Details page</div>
      </section>
    </div>
  );
}
