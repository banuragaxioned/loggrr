import { api } from "@/lib/api";
import { getCurrentUser } from "@/lib/session";
import Link from "next/link";

export function MyTeams() {
  const { data: myTeamData } = api.tenant.myTeams.useQuery();

  if (!myTeamData) {
    return null;
  }

  return (
    <span>
      <div className="container flex flex-col items-center justify-center gap-12">
        <h2>
          Welcome back, <span>{getCurrentUser.name}</span> 👋
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          {myTeamData.map((team) => (
            <Link
              key={team.id}
              className="hover:bg-zinc/20 flex max-w-xs flex-col gap-4 rounded-xl bg-zinc-400/10 p-4  hover:bg-zinc-400/20"
              href={team.slug}
            >
              <h3>{team.name}</h3>
              <div className="text-lg">
                The application lives here. Right now, its only layouts and static components.
              </div>
            </Link>
          ))}
        </div>
      </div>
    </span>
  );
}
