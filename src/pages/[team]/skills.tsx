/* eslint-disable react/no-unescaped-entities */
import Unavailable from "@/components/unavailable";
import { useValidateTenantAccess } from "@/hooks/tenantValidation";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function Projects() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const currentTenant = router.query.team as string;
  const allSkillList = api.skill.getAllSkills.useQuery(
    { tenant: currentTenant },
    { enabled: session?.user !== undefined }
  );
  const allSkillScores = api.skill.getAllSkillsScores.useQuery(
    { tenant: currentTenant },
    { enabled: session?.user !== undefined }
  );
  const mySkillScores = api.skill.getMySkillsScores.useQuery(
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
        <h2>My Skill Scores</h2>
        <ul className="flex flex-col gap-4">
          {mySkillScores.data &&
            mySkillScores.data.map((skills) => (
              <li
                key={skills.id}
                className="hover:bg-zinc/20 max-w-xs rounded-xl bg-zinc-400/10 p-4 hover:bg-zinc-400/20"
              >
                {skills.id} - {skills.skillLevel}
              </li>
            ))}
        </ul>
        <h3>All Skill Scores</h3>
        <ul className="flex flex-col gap-4">
          {allSkillScores.data &&
            allSkillScores.data.SkillScore.map((skills) => (
              <li
                key={skills.id}
                className="hover:bg-zinc/20 max-w-xs rounded-xl bg-zinc-400/10 p-4 hover:bg-zinc-400/20"
              >
                {skills.skillId} - {skills.skillLevel}
              </li>
            ))}
        </ul>
        <h3>Skill list (all)</h3>
        <ul className="flex flex-col gap-4">
          {allSkillList.data &&
            allSkillList.data.Skill.map((skills) => (
              <li
                key={skills.id}
                className="hover:bg-zinc/20 max-w-xs rounded-xl bg-zinc-400/10 p-4 hover:bg-zinc-400/20"
              >
                {skills.name}
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
