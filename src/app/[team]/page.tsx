import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { pageProps } from "@/types";
import { db } from "@/lib/db";
import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { BarChart2, Clipboard, HeartHandshake, Timer } from "lucide-react";
import CategoryDataBar from "@/components/charts/category-bar";
import { getTimeInHours } from "@/lib/helper";
import Image from "next/image";
import { ListBulletIcon } from "@radix-ui/react-icons";
import { DashboardHeader } from "@/components/ui/header";
import { DashboardShell } from "@/components/ui/shell";
import { TimeAdd } from "@/components/time-add";

export default async function Dashboard({ params }: pageProps) {
  const user = await getCurrentUser();
  const { team } = params;

  if (!user) {
    return notFound();
  }

  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  let sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const userTimeEntry = await db.timeEntry.findMany({
    where: {
      userId: user.id,
      date: { gte: sevenDaysAgo },
      Tenant: {
        slug: team,
      },
    },
    select: {
      time: true,
      Project: {
        select: {
          name: true,
        },
      },
    },
  });

  const overallEntryTime = userTimeEntry.map((item) => item.time).reduce((sum: number, num: number) => sum + num, 0);

  const Skeleton = () => (
    <div className="flex h-full min-h-[6rem] w-full flex-1 rounded-xl bg-gradient-to-br from-muted to-muted"></div>
  );

  const items = [
    {
      title: "Frequently used",
      icon: <Timer className="h-4 w-4" />,
      header: (
        <div className="flex h-full min-h-[6rem] w-full flex-1 flex-row space-x-2">
          <div className="flex h-full w-1/3 flex-col items-center justify-center rounded-2xl border border-border p-4 ">
            <Image
              src="https://pbs.twimg.com/profile_images/1337607516008501250/6Ggc4S5n_400x400.png"
              alt="avatar"
              height="100"
              width="100"
              className="h-10 w-10 rounded-full"
            />
            <p className="mt-4 text-center text-xs font-semibold sm:text-sm">Telsa</p>
          </div>
          <div className="flex h-full w-1/3 flex-col items-center justify-center rounded-2xl border border-border p-4 ">
            <Image
              src="https://pbs.twimg.com/profile_images/1723986418920267776/37PA6iM__400x400.jpg"
              alt="avatar"
              height="100"
              width="100"
              className="h-10 w-10 rounded-full"
            />
            <p className="mt-4 line-clamp-1 text-center	 text-xs font-semibold sm:text-sm">Liverpool Football Club</p>
          </div>
          <div className="flex h-full w-1/3 flex-col items-center justify-center rounded-2xl border border-border p-4">
            <Image
              src="https://pbs.twimg.com/profile_images/1697749409851985920/HbrI04tM_400x400.jpg"
              alt="avatar"
              height="100"
              width="100"
              className="h-10 w-10 rounded-full"
            />
            <p className="mt-4 text-center text-xs font-semibold sm:text-sm">SpaceX</p>
          </div>
        </div>
      ),
    },
    {
      title: "Time tracked this week",
      icon: <BarChart2 className="h-4 w-4" />,
      header: (
        <CategoryDataBar
          title="Logged hours"
          markerValue={getTimeInHours(overallEntryTime)}
          maxValue={37.5}
          type="hours"
        />
      ),
    },
    {
      title: "Time entries this week",
      description: <div>List</div>,
      icon: <ListBulletIcon className="h-4 w-4" />,
    },
    {
      title: "The Dawn of Innovation",
      description: "Explore the birth of groundbreaking ideas and inventions.",
      header: <Skeleton />,
      icon: <Clipboard className="h-4 w-4" />,
    },
    {
      title: "We appreciate your feedback",
      header: <Skeleton />,
      icon: <HeartHandshake className="h-4 w-4" />,
      className: "md:col-span-1",
    },
  ];

  return (
    <main className=" col-span-12 flex flex-col gap-4 lg:col-span-9">
      <DashboardShell>
        <DashboardHeader heading="Dashboard">
          <TimeAdd />
        </DashboardHeader>
        <BentoGrid>
          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              icon={item.icon}
              className={item.className ? "md:col-span-2" : ""}
            />
          ))}
        </BentoGrid>
      </DashboardShell>
    </main>
  );
}
