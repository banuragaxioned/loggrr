import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const workspace = await prisma.workspace.upsert({
    where: { slug: "axioned" },
    update: {},
    create: {
      name: "Axioned",
      slug: "axioned",
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
