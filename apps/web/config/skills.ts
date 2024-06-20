import { Ban, Brain, Circle, CircleDashed, CircleDot, CircleDotDashed, LucideIcon } from "lucide-react";

type Level = {
  id: number;
  value: number;
  name: string;
  icon: LucideIcon;
};

export const levels: Level[] = [
  {
    id: 0,
    value: 0,
    name: "NA",
    icon: Ban,
  },
  {
    id: 1,
    value: 1,
    name: "Beginner",
    icon: CircleDashed,
  },
  {
    id: 2,
    value: 2,
    name: "Intermediate",
    icon: Circle,
  },
  {
    id: 3,
    value: 3,
    name: "Senior",
    icon: CircleDotDashed,
  },
  {
    id: 4,
    value: 4,
    name: "Lead",
    icon: CircleDot,
  },
  {
    id: 5,
    value: 5,
    name: "Expert",
    icon: Brain,
  },
];
