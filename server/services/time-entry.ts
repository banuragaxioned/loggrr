import { db } from "@/server/db";
import { subDays } from "date-fns";
import { getServerSession } from "next-auth";

import { getTimeInHours, stringToBoolean } from "@/lib/helper";
import { authOptions } from "../auth";

export const getTimelogLastWeek = async (slug: string, userId: number) => {
  const today = new Date();
  const sevenDaysAgo = subDays(today, 7);

  const response = await db.timeEntry.aggregate({
    where: {
      userId,
      date: {
        gte: sevenDaysAgo,
      },
      workspace: {
        slug,
      },
    },
    _sum: {
      time: true,
    },
  });

  return response._sum.time ?? 0;
};

export const getWeekWiseEntries = async (slug: string, userId: number, weekCount: number = 1) => {
  const today = new Date();
  const totalDaysinSelectedWeek = subDays(today, weekCount * 7);

  const response = await db.timeEntry.groupBy({
    by: ["date"],
    orderBy: {
      date: "desc",
    },
    where: {
      userId: userId,
      workspace: {
        slug,
      },
      date: {
        gte: totalDaysinSelectedWeek,
      },
    },
    _sum: {
      time: true,
    },
  });

  return response;
};

// Gets last 7 days entries including today with unique project IDs
export const getRecentEntries = async (slug: string, userId: number) => {
  const today = new Date();
  const sevenDaysAgo = subDays(today, 8);

  const response = await db.timeEntry.findMany({
    distinct: ["projectId"],
    where: {
      workspace: {
        slug,
      },
      date: {
        gte: sevenDaysAgo,
      },
      userId,
    },
    select: {
      id: true,
      project: {
        select: {
          id: true,
          name: true,
          client: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      milestone: {
        select: {
          id: true,
          name: true,
        },
      },
      billable: true,
      time: true,
      comments: true,
    },
    orderBy: {
      id: "desc",
    },
  });

  return response;
};

export const getLogged = async (
  slug: string,
  startDate?: Date | null,
  endDate?: Date | null,
  billing?: string,
  project?: string,
  clients?: string,
  members?: string,
) => {
  const session = await getServerSession(authOptions);
  const loggedUserId = session && session.user.id;
  const isBillable = stringToBoolean(billing);

  const allClients = await db.client.findMany({
    where: {
      workspace: {
        slug: slug,
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  const allUsers = await db.user.findMany({
    where: {
      workspaces: {
        some: {
          workspace: {
            slug: slug,
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  const query = await db.client.findMany({
    where: {
      workspace: {
        slug: slug,
      },
      ...(clients && {
        id: {
          in: clients.split(",").map((id) => +id),
        },
      }),
      ...(members && {
        project: {
          every: {
            usersOnProject: {
              some: {
                userId: {
                  in: members?.split(",").map((id) => +id),
                },
              },
            },
          },
        },
      }),
    },
    select: {
      id: true,
      name: true,
      project: {
        where: {
          usersOnProject: {
            ...(loggedUserId &&
              project === "my" && {
                some: {
                  userId: loggedUserId,
                },
              }),
          },
          ...(project === "active" && {
            status: "PUBLISHED",
          }),
          ...(project === "archived" && {
            status: "ARCHIVED",
          }),
        },
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
          usersOnProject: {
            where: {
              ...(members && {
                userId: {
                  in: members?.split(",").map((id) => +id),
                },
              }),
            },
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  timeEntry: {
                    where: {
                      date: {
                        gte: startDate ? startDate : new Date(0),
                        lte: endDate ? endDate : new Date(),
                      },
                      billable: {
                        ...(isBillable !== null && { equals: isBillable }),
                      },
                      time: {
                        gt: 0, // Include only entries where time is greater than 0
                      },
                    },
                    orderBy: {
                      date: "desc",
                    },
                    select: {
                      date: true,
                      time: true,
                      billable: true,
                      comments: true,
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
                      projectId: true,
                    },
                  },
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
          users: project.usersOnProject.map((user) => {
            const timeEntryBasedOnProject = user.user.timeEntry.filter(
              (timeEntry) => timeEntry.projectId === project.id,
            );

            return {
              userId: user.user.id,
              userName: user.user.name,
              userImage: user.user.image,
              userHours: timeEntryBasedOnProject.reduce((sum, entry) => (sum += getTimeInHours(entry.time)), 0),
              userTimeEntry: timeEntryBasedOnProject.map((timeEntry) => {
                const inputDate = new Date(timeEntry.date);
                const formattedDate = inputDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "2-digit",
                });

                return {
                  formattedDate,
                  date: timeEntry.date,
                  time: getTimeInHours(timeEntry.time),
                  billable: timeEntry.billable,
                  comments: timeEntry.comments,
                  milestoneId: timeEntry.milestone.id,
                  milestone: timeEntry.milestone.name,
                  taskId: timeEntry.task?.id,
                  task: timeEntry.task?.name,
                };
              }),
            };
          }),
        };
      }),
    };
  });

  return { data: response, allClients, allUsers };
};
