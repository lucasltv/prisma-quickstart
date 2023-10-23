import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function createWithRelation() {
  const now = Date.now();
  return prisma.user.create({
    data: {
      name: "Bob " + now,
      email: now + "_bob@prisma.io",
      posts: {
        create: {
          title: "Hello World",
        },
      },
    },
  });
}

function getUsersWithPosts() {
  return prisma.user.findMany({
    include: {
      posts: true,
    },
  });
}

async function main() {
  await createWithRelation();
  const users = await prisma.user.findMany();
  console.log(users[0]);

  const usersWithPosts = await getUsersWithPosts();
  console.log(`main LOG:  usersWithPosts:`, usersWithPosts[0].posts);
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
