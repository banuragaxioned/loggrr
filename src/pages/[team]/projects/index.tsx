import Unavailable from "@/components/unavailable";
import { useValidateTenantAccess } from "@/hooks/tenantValidation";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Link from "next/link";
import CreateClient from "@/components/createClient";
import CreateProject from "../../../components/createProject";

export default function Projects() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const currentTenant = router.query.team as string;
  const clientList = api.client.getClients.useQuery(
    { text: currentTenant },
    { enabled: session?.user !== undefined }
  );
  const projectList = api.project.getProjects.useQuery(
    { text: currentTenant },
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
        <h2>Projects</h2>
        <CreateProject />
        <ul className="flex flex-col gap-4">
          {projectList.data &&
            projectList.data.map((project) => (
              <Link key={project.id} href={router.asPath + "/" + project.id}>
                <li className="hover:bg-zinc/20 max-w-xs rounded-xl bg-zinc-400/10 p-4 hover:bg-zinc-400/20">
                  {project.name}
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
    </div>
  );
}
