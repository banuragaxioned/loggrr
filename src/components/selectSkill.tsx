"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Ban, Brain, Circle, CircleDashed, CircleDot, CircleDotDashed, LucideIcon } from "lucide-react";

type Scores = {
  id: number;
  name: string;
  level: number;
};

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

export function SelectSkillLevel({ skill, setValue, className }: { skill: Scores; setValue: (skill: number, value: string) => void, className?: string }) {
  return (
    <Select defaultValue={String(skill.level)} onValueChange={(value) => setValue(skill.id, value)}>
      <SelectTrigger className={cn("w-full", className)}>
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
  );
}
