import Unavailable from "@/components/unavailable";
import { useValidateTeamAccess } from "@/hooks/useTeam";
import { api } from "@/utils/api";

export default function GlobalReportsAssigned() {
  const { isLoading, isInvalid, isReady, slug } = useValidateTeamAccess();
  const reportData = api.report.getAssigned.useQuery({ tenant: slug }, { enabled: isReady });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isInvalid) {
    return <Unavailable />;
  }
  return (
    <div className="mx-auto flex max-w-6xl gap-4">
      <section>
        <h2>Global Assignment Data</h2>
        <ul className="flex flex-col gap-4">
          {reportData.data &&
            reportData.data.map((logged) => (
              <li
                key={logged.id}
                className="hover:bg-zinc/20 max-w-none rounded-xl bg-zinc-400/10 p-4 hover:bg-zinc-400/20"
              >
                {logged.User.name} - {logged.Project.Client.name} - {logged.Project.name} - {logged.billableTime}m (B)
                and {logged.nonBillableTime}m (NB)
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
