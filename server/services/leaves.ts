import { db } from "@/server/db";

export const getLeaves = async (team: string) => {
  const data = await db.userLeaves.findMany({
    where: { workspace: { slug: team } },
    select: {
      id: true,
      leaves: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
    orderBy: {
      user: {
        name: "asc",
      },
    },
  });

  return data;
};

export type LeaveDetails =
  | {
      planned: { eligible: number; taken: number };
      unplanned: { eligible: number; taken: number };
      compoff: { eligible: number; taken: number };
    }
  | undefined;

export const getLeave = async (team: string, id: number): Promise<{ leave: LeaveDetails; updatedAt: Date } | null> => {
  const data = await db.userLeaves.findFirst({
    where: {
      userId: id,
      workspace: {
        slug: team,
      },
    },
    select: {
      id: true,
      leaves: true,
      updatedAt: true,
    },
  });

  if (!data) {
    return null;
  }

  return { leave: data?.leaves as LeaveDetails, updatedAt: data?.updatedAt };
};
