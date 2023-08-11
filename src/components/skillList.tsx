"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tenant } from "@prisma/client";
import useToast from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import { SelectSkillLevel } from "./selectSkill";

type Scores = {
  id: number;
  name: string;
  level: number;
}[];

export function SkillList({ props, currentUser, team }: { props: Scores; currentUser: number; team: Tenant["slug"] }) {
  const router = useRouter();
  const showToast = useToast();

  async function Update(skill: number, value: string) {
    const response = await fetch("/api/team/skill/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        team: team,
        userId: currentUser,
        skillId: skill,
        level: Number(value),
      }),
    });

    if (response?.ok) showToast("Skill updated", "success");

    router.refresh();
  }

  return (
    <Card>
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
                <SelectSkillLevel skill={skill} setValue={Update} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
