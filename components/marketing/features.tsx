import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { BookOpen, Bot, LucideGanttChartSquare, Timer } from "lucide-react";

export function FeaturesSection() {
  return (
    <BentoGrid className="mx-auto max-w-4xl md:auto-rows-[20rem]">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          className={item.className}
          icon={item.icon}
        />
      ))}
    </BentoGrid>
  );
}
const Skeleton = () => (
  <div className="flex h-full min-h-[6rem] w-full flex-1 rounded-xl border border-transparent bg-muted"></div>
);
const items = [
  {
    title: "Effortless time tracking",
    description: "Track time and sync up with your team in a few clicks.",
    header: <Skeleton />,
    className: "md:col-span-2",
    icon: <Timer className="h-4 w-4" />,
  },
  {
    title: "Manage work allocation",
    description: "Allocate work to your team and track their progress.",
    header: <Skeleton />,
    className: "md:col-span-1",
    icon: <LucideGanttChartSquare className="h-4 w-4" />,
  },
  {
    title: "Smart suggestions",
    description: "Get recommendations based on your work allocation and previous activity.",
    header: <Skeleton />,
    className: "md:col-span-1",
    icon: <Bot className="h-4 w-4" />,
  },
  {
    title: "Designed for transparent teams",
    description: "Built to be transparent and open by default - letting everyone know what's going on.",
    header: <Skeleton />,
    className: "md:col-span-2",
    icon: <BookOpen className="h-4 w-4" />,
  },
];
