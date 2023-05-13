import Unavailable from "@/components/unavailable";
import { useValidateTeamAccess } from "@/hooks/useTeam";
import { api } from "@/lib/api";
import useToast from "@/hooks/useToast";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Projects() {
  const { isLoading, isInvalid, isReady, currentTeam } = useValidateTeamAccess();
  const showToast = useToast();
  const allSkillList = api.skill.getAllSkills.useQuery({ tenant: currentTeam }, { enabled: isReady });
  const allSkillScores = api.skill.getAllSkillsScores.useQuery({ tenant: currentTeam }, { enabled: isReady });
  const mySkillScores = api.skill.getMySkillsScores.useQuery({ tenant: currentTeam }, { enabled: isReady });

  const { register, handleSubmit, reset, getValues } = useForm({ shouldUseNativeValidation: true });

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

  const allSkillScoreDataColumns = ["user", "skill", "level"];
  const mySkillsDataColumns = ["skill", "level"];
  const skillListDataColumns = ["name"];

  return (
    <div className="mx-auto flex max-w-6xl gap-4">
      <section>
        <h2>My Skill Scores</h2>
        {/* <TableUI rows={mySkillScores.data} columns={mySkillsDataColumns} /> */}
        <h2>All Skill Scores</h2>
        {/* <TableUI rows={allSkillScores.data} columns={allSkillScoreDataColumns} /> */}
        <h2>Skill list (all)</h2>
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
          {/* <TableUI rows={allSkillList.data} columns={skillListDataColumns} /> */}
        </ul>
      </section>
    </div>
  );
}
