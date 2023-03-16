import Link from "next/link";
import { useRouter } from "next/router";
import Unavailable from "@/components/unavailable";
import { useValidateTenantAccess } from "@/hooks/tenantValidation";

export default function Projects() {
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
      <section>
        <h2>Project List</h2>
        <div className="todo h-14">
          <Link href={router.asPath + "/pid"}>Project Details</Link>
        </div>
      </section>
    </div>
  );
}
