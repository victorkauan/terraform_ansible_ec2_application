import { prisma } from "../src/lib/prisma";

async function seed() {
  await prisma.event.create({
    data: {
      id: "40426e21-b0a2-4d13-89d5-fc6acdf80ee4",
      title: "Prisma Conference 2023",
      slug: "prisma-conference-2023",
      details:
        "Join us for the Prisma Conference 2023, where we explore the future of database management.",
      maximunAttendees: 5,
    },
  });
}

seed().then(() => {
  console.log("Seeding completed");
  prisma.$disconnect();
});
