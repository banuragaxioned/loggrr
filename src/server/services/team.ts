import { prisma } from "../db";

export const getTeamName = async (slug: string) => {
    const team = await prisma.tenant.findFirst({
      where:{slug:slug},
      select:{
        name:true
      }
    })
    return team?.name;
  }
  