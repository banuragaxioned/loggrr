import React from "react";
import Image from "next/image";
import { BookOpen, Inbox, LucideGanttChartSquare, Scaling, Timer } from "lucide-react";

import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";

import timeTrack from "@/assets/images/svgs/time-tracking.svg";
import smartSuggestions from "@/assets/images/svgs/smart-suggestions.svg";
import automatedReminders from "@/assets/images/svgs/automated-reminders.svg";
import transparentTeams from "@/assets/images/svgs/transparent-teams.svg";
import workAllocation from "@/assets/images/svgs/work-allocation.svg";
import generateReports from "@/assets/images/svgs/generate-reports.svg";
import flexibility from "@/assets/images/svgs/flexibility.svg";

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
    header: <Image src={timeTrack} alt="Effortless time tracking" className="dark:grayscale dark:invert" />,
    className: "md:col-span-2",
    icon: <Timer className="h-4 w-4" />,
  },
  {
    title: "Smart suggestions",
    description: "Get smart recommendations and quick actions.",
    header: <Image src={smartSuggestions} alt="Smart Suggestions" className="dark:grayscale dark:invert" />,
    className: "md:col-span-1",
    icon: <span>✨</span>,
  },
  {
    title: "Automated reminders",
    description: "Get reminders to log your time, so you don't have to worry about it.",
    header: <Image src={automatedReminders} alt="Automated Reminders" className="dark:grayscale dark:invert" />,
    className: "md:col-span-1",
    icon: <Inbox className="h-4 w-4" />,
  },
  {
    title: "Flexibility",
    description:
      "Get as specific or as broad as you need to. Track strategic milestones, retainers, or tasks (if you needed to).",
    header: <Image src={flexibility} alt="Flexibility" className="dark:grayscale dark:invert" />,
    className: "md:col-span-2",
    icon: <Scaling className="h-4 w-4" />,
  },
  {
    title: "Simplified work allocation 🚧",
    description: "Know what's on your plate, work to your team and track their progress.",
    header: <Image src={workAllocation} alt="Work Allocation" className="dark:grayscale dark:invert" />,
    className: "md:col-span-1",
    icon: <LucideGanttChartSquare className="h-4 w-4" />,
  },
  {
    title: "Generate reports",
    description: "Straightforward reports to help you understand and share your progress.",
    header: <Image src={generateReports} alt="Generate Reports" className="dark:grayscale dark:invert" />,
    className: "md:col-span-1",
    icon: <LucideGanttChartSquare className="h-4 w-4" />,
  },
  {
    title: "Designed for transparent teams",
    description: "Built to be transparent and open - letting everyone know what's going on.",
    header: <Image src={transparentTeams} alt="Transparent Teams" className="dark:grayscale dark:invert" />,
    className: "md:col-span-1",
    icon: <BookOpen className="h-4 w-4" />,
  },
];
