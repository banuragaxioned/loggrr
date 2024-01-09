import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.upsert({
    where: { email: "anurag@axioned.com" },
    update: {},
    create: {
      email: "anurag@axioned.com",
      name: "Anurag Banerjee",
    },
  });
  const user2 = await prisma.user.upsert({
    where: { email: "vipiny@axioned.com" },
    update: {},
    create: {
      email: "vipiny@axioned.com",
      name: "Vipin Yadav",
    },
  });
  const user3 = await prisma.user.upsert({
    where: { email: "ajayp@axioned.com" },
    update: {},
    create: {
      email: "ajayp@axioned.com",
      name: "Ajay Pawar",
    },
  });
  const workspace = await prisma.workspace.upsert({
    where: { slug: "axioned" },
    update: {},
    create: {
      name: "Axioned",
      slug: "axioned",
      Users: {
        connect: [
          {
            id: user1.id,
          },
          {
            id: user2.id,
          },
          {
            id: user3.id,
          },
        ],
      },
    },
  });

  const role1 = await prisma.userRole.upsert({
    where: { id: 1 },
    update: {},
    create: {
      workspaceId: workspace.id,
      userId: user1.id,
      role: "USER",
    },
  });

  const role2 = await prisma.userRole.upsert({
    where: { id: 2 },
    update: {},
    create: {
      workspaceId: workspace.id,
      userId: user1.id,
      role: "MANAGER",
    },
  });

  const role3 = await prisma.userRole.upsert({
    where: { id: 3 },
    update: {},
    create: {
      workspaceId: workspace.id,
      userId: user1.id,
      role: "USER",
    },
  });

  const client = await prisma.client.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Axioned",
      workspaceId: workspace.id,
    },
  });
  const project = await prisma.project.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Loggr",
      clientId: client.id,
      ownerId: user1.id,
      workspaceId: workspace.id,
      interval: "MONTHLY",
      startdate: new Date(),
      budget: 100,
    },
  });
  const milestone = await prisma.milestone.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "MVP",
      projectId: project.id,
      workspaceId: workspace.id,
      budget: 100,
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
