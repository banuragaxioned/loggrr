import Unavailable from "@/components/unavailable";
import { useValidateTenantAccess } from "@/hooks/tenantValidation";
import { api } from "@/utils/api";
import { useRouter } from "next/router";

export default function GlobalReportsAssigned() {
  const router = useRouter();
  const currentTenant = router.query.team as string;
  const reportData = api.report.getAssigned.useQuery({ tenant: currentTenant });

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
          {reportData.data &&
            reportData.data.map((logged) => (
              <li
                key={logged.id}
                className="hover:bg-zinc/20 max-w-none rounded-xl bg-zinc-400/10 p-4 hover:bg-zinc-400/20"
              >
                {logged.User.name} - {logged.Project.Client.name} -{" "}
                {logged.Project.name} - {logged.billable}m (B) and{" "}
                {logged.nonbillable}m (NB)
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
