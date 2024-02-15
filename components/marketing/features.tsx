import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { BookOpen, Inbox, LucideGanttChartSquare, Scaling, Timer } from "lucide-react";

export function FeaturesSection() {
  return (
    <BentoGrid className="mx-auto max-w-5xl md:auto-rows-[20rem]">
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
    description: "Track time and sync up with your team in a few clicks, and make time tracking a breeze.",
    header: <Skeleton />,
    className: "md:col-span-2",
    icon: <Timer className="h-4 w-4" />,
  },
  {
    title: "Smart suggestions",
    description: "Get smart recommendations and quick actions.",
    header: <Skeleton />,
    className: "md:col-span-1",
    icon: <span>✨</span>,
  },
  {
    title: "Automated reminders",
    description: "Get reminders to log your time, so you don't have to worry about it.",
    header: <Skeleton />,
    className: "md:col-span-1",
    icon: <Inbox className="h-4 w-4" />,
  },
  {
    title: "Flexibility",
    description:
      "Get as specific or as broad as you need to. Track strategic milestones, retainers, or tasks (if you needed to).",
    header: <Skeleton />,
    className: "md:col-span-2",
    icon: <Scaling className="h-4 w-4" />,
  },
  {
    title: "Simplified work allocation 🚧",
    description: "Know what's on your plate, work to your team and track their progress.",
    header: <Skeleton />,
    className: "md:col-span-1",
    icon: <LucideGanttChartSquare className="h-4 w-4" />,
  },
  {
    title: "Generate reports",
    description: "Straightforward reports to help you understand and share your progress.",
    header: <Skeleton />,
    className: "md:col-span-1",
    icon: <LucideGanttChartSquare className="h-4 w-4" />,
  },
  {
    title: "Designed for transparent teams",
    description: "Built to be transparent and open - letting everyone know what's going on.",
    header: <Skeleton />,
    className: "md:col-span-1",
    icon: <BookOpen className="h-4 w-4" />,
  },
];
