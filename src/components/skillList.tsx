"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skill } from "@prisma/client";
import { Ban, Brain, Circle, CircleDashed, CircleDot, CircleDotDashed, LucideIcon } from "lucide-react";

type Scores = {
  id: number;
  name: string;
  level: number;
}[];

type Level = {
  id: number;
  name: string;
  icon: LucideIcon;
};

const levels: Level[] = [
  {
    id: 0,
    name: "NA",
    icon: Ban,
  },
  {
    id: 1,
    name: "Beginner",
    icon: CircleDashed,
  },
  {
    id: 2,
    name: "Intermediate",
    icon: Circle,
  },
  {
    id: 3,
    name: "Senior",
    icon: CircleDotDashed,
  },
  {
    id: 4,
    name: "Lead",
    icon: CircleDot,
  },
  {
    id: 5,
    name: "Expert",
    icon: Brain,
  },
];

async function Update(skill: number, value: string) {
  console.log(skill, Number(value));
}

export function SkillList({ props }: { props: Scores }) {
  return (
    <div className="grid gap-6">
      {props.map((skill) => (
        <div key={skill.id} className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <div>
              <p className="text-sm font-medium leading-none">{skill.name}</p>
            </div>
          </div>
          <Select defaultValue={String(skill.level)} onValueChange={(value) => Update(skill.id, value)}>
            <SelectTrigger className="ml-auto w-[200px]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {levels.map((level) => (
                <SelectItem key={level.id} value={String(level.id)}>
                  <div className="flex items-center space-x-4">
                    <div>
                      <level.icon size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">{level.name}</p>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
}
