import { prisma } from "../db";
import { db } from "@/lib/db";
import { AllocationFrequency } from "@prisma/client";
import { AllocationDates } from "@/types";
import dayjs from "dayjs";

interface AllocationDate {
  id: number;
  billableTime: number;
  nonBillableTime: number;
  updatedAt: Date;
  frequency: AllocationFrequency;
  date: Date;
  enddate: Date | any;
}

export async function getProjectsId(slug: string) {
  const projects = await db.project.findMany({
    where: { Tenant: { slug } },
    select: {
      id: true,
      name: true,
      Members: { select: { id: true, name: true } },
    },
  });

  return projects;
}

export const getAllUsers = async (slug: string) => {
  const users = await prisma.user.findMany({
    where: { TenantId: { some: { slug } } },
    select: {
      id: true,
      name: true,
      Allocation: { select: { id: true, projectId: true } },
    },
  });
  return users;
};
