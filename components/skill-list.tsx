"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Workspace } from "@prisma/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SingleSelectDropdown } from "./ui/single-select-dropdown";
import { levels } from "@/config/skills";

type Scores = {
  id: number;
  name: string;
  value: number;
}[];

export function SkillList({
  props,
  currentUser,
  team,
}: {
  props: Scores;
  currentUser: number;
  team: Workspace["slug"];
}) {
  const router = useRouter();

  async function Update(value: string, scoreId: number) {
    const response = await fetch("/api/team/skill/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        team: team,
        level: Number(value),
        scoreId,
      }),
    });

    if (response?.ok) toast.success("Skill updated");

    router.refresh();
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Update skills</CardTitle>
        <CardDescription>Select the new value from the dropdown</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          {props.map((skill) => (
            <div key={skill.id} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <div>
                  <p className="text-sm font-medium leading-none">{skill.name}</p>
                </div>
              </div>
              <div className="ml-auto w-[200px]">
                <SingleSelectDropdown
                  options={levels}
                  defaultValue={skill}
                  setOptions={(value: string) => Update(value, Number(skill.id))}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
