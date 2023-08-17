import { Ban, Brain, Circle, CircleDashed, CircleDot, CircleDotDashed, LucideIcon } from "lucide-react";

type Level = {
  id: number;
  name: string;
  icon: LucideIcon;
};

export const levels: Level[] = [
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