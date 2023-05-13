import Unavailable from "@/components/unavailable";
import { useValidateTeamAccess } from "@/hooks/useTeam";
import { api } from "@/lib/api";

export default function Projects() {
  const { isLoading, isInvalid, isReady, currentTeam } = useValidateTeamAccess();
  const reportData = api.report.getLogged.useQuery({ tenant: currentTeam }, { enabled: isReady });

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
                {logged.date.toLocaleDateString()}-{logged.user} - {logged.client} - {logged.project} - {logged.time}m{" "}
                {logged.billable ? <span>🟢</span> : <span>🔴</span>} - {logged.comments}
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
