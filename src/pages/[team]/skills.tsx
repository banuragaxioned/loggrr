import Unavailable from "@/components/unavailable";
import { useValidateTeamAccess } from "@/hooks/useTeam";
import { api } from "@/utils/api";
import useToast from "@/hooks/useToast";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Projects() {
  const { isLoading, isInvalid, isReady, slug } = useValidateTeamAccess();
  const showToast = useToast();

  const currentTeam = slug;
  const allSkillList = api.skill.getAllSkills.useQuery({ tenant: currentTeam }, { enabled: isReady });
  const allSkillScores = api.skill.getAllSkillsScores.useQuery({ tenant: currentTeam }, { enabled: isReady });
  const mySkillScores = api.skill.getMySkillsScores.useQuery({ tenant: currentTeam }, { enabled: isReady });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm({ shouldUseNativeValidation: true });

  const onSubmit = (data: any) => {
    addSkill();
  };

  const createSkill = api.skill.createSkill.useMutation({
    onSuccess: (data) => {
      reset();
      showToast("A new Skill was created", "success");
    },
  });

  const addSkill = () => {
    const newSkill = createSkill.mutate({
      name: getValues("skill_name"),
      slug: currentTeam,
    });
    return newSkill;
  };

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
            mySkillScores.data.map((mySkills) => (
              <li
                key={mySkills.id}
                className="hover:bg-zinc/20 max-w-xs rounded-xl bg-zinc-400/10 p-4 hover:bg-zinc-400/20"
              >
                {mySkills.skill} - {mySkills.level}
              </li>
            ))}
        </ul>
        <h3>All Skill Scores</h3>
        <ul className="flex flex-col gap-4">
          {allSkillScores.data &&
            allSkillScores.data.map((skills) => (
              <li
                key={skills.id}
                className="hover:bg-zinc/20 max-w-md rounded-xl bg-zinc-400/10 p-4 hover:bg-zinc-400/20"
              >
                {skills.User.name}- {skills.Skill.name} - {skills.skillLevel}
              </li>
            ))}
        </ul>
        <h3>Skill list (all)</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            type="text"
            placeholder="Skill name"
            {...register("skill_name", {
              required: "Please enter a Skill name",
              maxLength: 15,
            })}
          />
          <Button type="submit" className="my-2">
            Submit
          </Button>
        </form>
        <ul className="flex flex-col gap-4">
          {allSkillList.data &&
            allSkillList.data.map((skills) => (
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
