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
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console -- For CLI feedback
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
