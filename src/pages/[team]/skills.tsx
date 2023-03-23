/* eslint-disable react/no-unescaped-entities */
import Unavailable from "@/components/unavailable";
import { useValidateTenantAccess } from "@/hooks/tenantValidation";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Projects() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const currentTenant = router.query.team as string;
  const skillList = api.skill.getAllSkills.useQuery(
    { text: currentTenant },
    { enabled: session?.user !== undefined }
  );
  const mySkillList = api.project.getProjects.useQuery(
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
        <h2>My Skills</h2>
        <ul className="flex flex-col gap-4">
          {mySkillList.data &&
            mySkillList.data.Project.map((project) => (
              <Link key={project.id} href={router.asPath + "/" + project.id}>
                <li className="hover:bg-zinc/20 max-w-xs rounded-xl bg-zinc-400/10 p-4 hover:bg-zinc-400/20">
                  {project.name}
                </li>
              </Link>
            ))}
        </ul>
        <h2>All Users Skills summary</h2>
        <ul className="flex flex-col gap-4">
          {skillList.data &&
            skillList.data.Client.map((client) => (
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
