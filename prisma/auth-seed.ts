import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Delete existing auth users
  await prisma.authUser.deleteMany();

  // Create NEERAJ04 with password "neeraj04"
  const hashedPassword = await bcrypt.hash("neeraj04", 12);
  const securityAnswer = await bcrypt.hash("breakout", 12); // security answer: "breakout"

  await prisma.authUser.create({
    data: {
      username: "NEERAJ04",
      hashedPassword,
      securityAnswer,
    },
  });

  console.log("✅ Auth user seeded: NEERAJ04 / neeraj04");
  console.log("   Security answer: breakout");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
