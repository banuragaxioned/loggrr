import Unavailable from "@/components/unavailable";
import { useValidateTenantAccess } from "@/hooks/useTenant";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import Link from "next/link";
import CreateClient from "@/components/createClient";
import CreateProject from "@/components/createProject";
import TableUI from "@/components/ui/table";

export default function Projects() {
  const { isLoading, isInvalid, isReady, slug } = useValidateTenantAccess();

  const router = useRouter();
  const currentTenant = slug;
  const clientList = api.client.getClients.useQuery({ text: currentTenant }, { enabled: isReady });
  const projectList = api.project.getProjects.useQuery({ text: currentTenant }, { enabled: isReady });

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

  const defaultDataColumns = ["name", "age", "visits", "status", "progress"];

  const defaultData: Person[] = [
    {
      name: "tanner",
      age: 24,
      visits: 100,
      status: "In Relationship",
      progress: 50,
    },
    {
      name: "tandy",
      age: 40,
      visits: 40,
      status: "Single",
      progress: 80,
    },
    {
      name: "joe",
      age: 45,
      visits: 20,
      status: "Complicated",
      progress: 10,
    },
  ];
  return (
    <div className="mx-auto flex max-w-6xl gap-4">
      <section>
        <TableUI rows={defaultData} columns={defaultDataColumns} />
        {/* TODO: pass projectList, infer the column names from the response  */}
        <h2>Projects</h2>
        <CreateProject />
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
        <ul className="flex flex-col gap-4">
          {clientList.data &&
            clientList.data.map((client) => (
              <li
                key={client.id}
                className="hover:bg-zinc/20 max-w-xs rounded-xl bg-zinc-400/10 p-4 hover:bg-zinc-400/20"
              >
                {client.name}
              </li>
            ))}
        </ul>
      </section>
      <section></section>
    </div>
  );
}
