"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Users } from "lucide-react";
import { motion, useTransform, useMotionValue, useSpring } from "framer-motion";
import { Card, CardHeader } from "@/components/ui/card";

const MEMBERS_COUNT = 7;
export const TeamsCard = ({
  items,
  activeUserCount,
}: {
  items:
    | {
        id: number;
        name: string | null;
        email: string;
        image: string | null;
      }[]
    | undefined;
  activeUserCount: number;
}) => {
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0); // going to set this value on mouse move
  // rotate the tooltip
  const rotate = useSpring(useTransform(x, [-100, 100], [-45, 45]), springConfig);
  // translate the tooltip
  const translateX = useSpring(useTransform(x, [-100, 100], [-50, 50]), springConfig);
  const handleMouseMove = (event: any) => {
    const halfWidth = event.target.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth); // set the x value, which is then used in transform and rotate
  };

  const noMembers = (
    <div className="text-center text-muted-foreground">No members found. Add some members to your project.</div>
  );

  // Get 7 members from items
  const members = items?.slice(0, MEMBERS_COUNT);
  const remainingMembers = (items && items?.length - MEMBERS_COUNT) || 0;

  const renderMembers = members?.map((item) => (
    <div
      className="group relative -mr-4"
      key={item.name}
      onMouseEnter={() => setHoveredIndex(item.id)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {hoveredIndex === item.id && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.6 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
              type: "spring",
              stiffness: 260,
              damping: 10,
            },
          }}
          exit={{ opacity: 0, y: 20, scale: 0.6 }}
          style={{
            // translateX: translateX,
            // rotate: rotate,
            whiteSpace: "nowrap",
          }}
          className="absolute -left-1/2 -top-16 z-50 flex translate-x-1/2  flex-col items-center justify-center rounded-md bg-black px-4 py-2 text-xs shadow-xl"
        >
          <div className="absolute inset-x-10 -bottom-px z-30 h-px w-[20%] bg-gradient-to-r from-transparent via-emerald-500 to-transparent " />
          <div className="absolute -bottom-px left-10 z-30 h-px w-[40%] bg-gradient-to-r from-transparent via-sky-500 to-transparent " />
          <div className="relative z-30 text-base font-bold text-white">{item.name}</div>
          <div className="text-xs text-white">{item.email}</div>
        </motion.div>
      )}
      {item.name && item.image && (
        <Image
          onMouseMove={handleMouseMove}
          height={100}
          width={100}
          src={item.image}
          alt={item.name}
          className="relative !m-0 h-11 w-11 cursor-pointer rounded-full border-2 border-white object-cover object-top !p-0 transition  duration-500 group-hover:z-30 group-hover:scale-105"
        />
      )}
    </div>
  ));

  return (
    <Card className="p-4 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 text-muted-foreground">
        <p className="text-lg font-semibold">Team</p>
        <Users size={16} />
      </CardHeader>
      <div className="mt-4">
        {items && items?.length > 0 ? (
          <>
            <div className="flex w-[80%] flex-row items-center">{renderMembers}</div>
            {remainingMembers > 0 && (
              <Link href={`${pathname}/members`} className="mt-1 font-semibold hover:underline">
                +{remainingMembers} more member{remainingMembers > 1 && "s"}
              </Link>
            )}
            <div className="mt-3 text-sm text-muted-foreground">{activeUserCount} active over last 30 days</div>
          </>
        ) : (
          noMembers
        )}
      </div>
    </Card>
  );
};
