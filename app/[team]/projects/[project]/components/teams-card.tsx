"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Users } from "lucide-react";

import { cn } from "@/lib/utils";

import { Card, CardHeader } from "@/components/ui/card";
import { CustomTooltip } from "@/components/custom/tooltip";
import { UserAvatar } from "@/components/user-avatar";

const MEMBERS_COUNT = 7;

const TeamsCard = ({
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
  const params = useParams();

  // Get 7 members from items
  const members = items?.slice(0, MEMBERS_COUNT);
  const remainingMembers = (items && items?.length - MEMBERS_COUNT) || 0;

  const noMembers = (
    <div className="text-center text-muted-foreground">No members found. Add some members to your project.</div>
  );

  const renderMembers = members?.map((item) => (
    <div className="group relative -mr-4" key={item.name}>
      {item.name && (
        <CustomTooltip
          trigger={
            <div>
              <UserAvatar
                user={{ name: item.name ?? null, image: item.image ?? null }}
                className="relative !m-0 h-11 w-11 cursor-pointer rounded-full border-2 border-white object-cover object-top !p-0 transition  duration-500 group-hover:z-30 group-hover:scale-105"
              />
            </div>
          }
          content={item.name}
        />
      )}
    </div>
  ));

  return (
    <Card className="p-4 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0">
        <p className="font-semibold">Team</p>
        <Users size={16} className="text-muted-foreground" />
      </CardHeader>
      <div className="mt-4">
        {items && items?.length > 0 ? (
          <>
            <div className={cn("flex w-[80%] flex-row items-center", remainingMembers < 1 && "relative top-2.5")}>
              {renderMembers}
            </div>
            <Link
              href={`/${params.team}/projects/${params.project}/members`}
              className={cn("mt-1 font-semibold hover:underline", remainingMembers < 1 && "invisible")}
              title="View all members"
            >
              +{remainingMembers} more member{remainingMembers > 1 && "s"}
            </Link>
            <div className="mt-3 text-sm text-muted-foreground">{activeUserCount} active over last 30 days</div>
          </>
        ) : (
          noMembers
        )}
      </div>
    </Card>
  );
};

export default TeamsCard;
