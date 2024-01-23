import { db } from "@/server/db";

export const getTimelogLastWeek = async (slug: string, userId: number) => {
  const response = await db.timeEntry.findMany({
    where: {
      userId: userId,
      date: {
        gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
      workspace: {
        slug: slug,
      },
    },
    select: {
      time: true,
      project: {
        select: {
          name: true,
        },
      },
    },
  });
  return response;
};

export const getLogged = async (slug: string, startDate?: Date, endDate?: Date) => {
  const query = await db.client.findMany({
    where: {
      workspace: {
        slug: slug,
      },
    },
    select: {
      id: true,
      name: true,
      project: {
        select: {
          id: true,
          name: true,
          budget: true,
          status: true,
          billable: true,
          client: {
            select: {
              id: true,
              name: true,
            },
          },
          timeEntry: {
            where: {
              date: {
                gte: startDate ? startDate : new Date(new Date().setDate(new Date().getDate() - 30)),
                lte: endDate ? endDate : new Date(),
              },
            },
            select: {
              date: true,
              time: true,
              billable: true,
              milestone: {
                select: {
                  id: true,
                  name: true,
                },
              },
              task: {
                select: {
                  id: true,
                  name: true,
                },
              },
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  // flatten the response
  const response = query.map((entry) => {
    return {
      clientId: entry.id,
      clientName: entry.name,
      projects: entry.project.map((project) => {
        return {
          projectId: project.id,
          projectName: project.name,
          projectBillable: project.billable,
          projectBudget: project.budget,
          projectStatus: project.status,
          timeEntries: project.timeEntry.map((timeEntry) => {
            return {
              user: timeEntry.user.name,
              date: timeEntry.date,
              time: timeEntry.time,
              billable: timeEntry.billable,
              milestone: timeEntry.milestone.name,
              task: timeEntry.task?.name,
            };
          }),
        };
      }),
    };
  });

  return response;
};
