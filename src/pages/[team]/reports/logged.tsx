import Unavailable from "@/components/unavailable";
import { useValidateTenantAccess } from "@/hooks/tenantValidation";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function Projects() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const currentTenant = router.query.team as string;
  const allSkillList = api.timeEntry.getAll.useQuery(
    { tenant: currentTenant },
    { enabled: session?.user !== undefined }
  );

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
        <h2>Global Logged Data</h2>
        <ul className="flex flex-col gap-4">
          {allSkillList.data &&
            allSkillList.data.map((timeEntry) => (
              <li
                key={timeEntry.id}
                className="hover:bg-zinc/20 max-w-none rounded-xl bg-zinc-400/10 p-4 hover:bg-zinc-400/20"
              >
                {timeEntry.updatedAt.toLocaleDateString()}-{" "}
                {timeEntry.Project.Client.name} - {timeEntry.Project.name} -{" "}
                {timeEntry.time}m{" "}
                {timeEntry.billable ? <span>🟢</span> : <span>🔴</span>} -{" "}
                {timeEntry.comments}
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
