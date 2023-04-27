import Unavailable from "@/components/unavailable";
import { useValidateTeamAccess } from "@/hooks/useTeam";
import { api } from "@/lib/api";
import { useRouter } from "next/router";
import Link from "next/link";
import CreateClient from "@/components/createClient";
import CreateProject from "@/components/createProject";
import TableUI from "@/components/ui/table";

export default function Projects() {
  const { isLoading, isInvalid, isReady, currentTeam } = useValidateTeamAccess();

  const router = useRouter();
  const clientList = api.client.getClients.useQuery({ text: currentTeam }, { enabled: isReady });
  const projectList = api.project.getProjects.useQuery({ slug: currentTeam }, { enabled: isReady });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isInvalid) {
    return <Unavailable />;
  }
  type Person = {
    name: string;
    age: number;
    visits: number;
    status: string;
    progress: number;
  };

  const projectDataColumns = ["name", "client", "startdate", "enddate", "owner", "status"];
  const clientDataColumns = ["name", "status"];

  return (
    <div className="mx-auto flex max-w-6xl gap-4">
      <section>
        <h2>Projects</h2>
        <CreateProject />
        <TableUI rows={projectList.data} columns={projectDataColumns} />
        <ul className="flex max-w-xs flex-col gap-4">
          {projectList.data &&
            projectList.data.map((project) => (
              <Link key={project.id} href={router.asPath + "/" + project.id}>
                <li className="hover:bg-zinc/20 max-w-xs rounded-xl bg-zinc-400/10 p-4 hover:bg-zinc-400/20">
                  {project.name} - {project.status}
                </li>
              </Link>
            ))}
        </ul>
        <h3>Client list</h3>
        <CreateClient />
        <TableUI rows={clientList.data} columns={clientDataColumns} />
      </section>
    </div>
  );
}
