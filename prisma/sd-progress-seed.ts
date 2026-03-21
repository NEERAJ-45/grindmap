import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const checkedTitles = [
  "Relational Databases — Fundamentals",
  "B+ Tree Indexing — Node Structure (Internal vs Leaf)",
  "B+ Tree — Branching Factor",
  "B+ Tree — Disk I/O Reduction Logic",
  "Clustered vs Non-Clustered Index — Storage Layout",
  "Clustered vs Non-Clustered — Performance Implications",
  "Covering Index — Index-Only Scan",
  "Covering Index — When It Avoids Table Lookup",
  "Query Execution Plan — Reading EXPLAIN Output",
  "Identifying Full Table Scan vs Index Scan",
  "Write-Ahead Logging (WAL) — Log-First Write Principle",
  "WAL — Crash Recovery Flow",
  "Checkpointing — Why Checkpoints Exist",
  "Checkpointing — Frequency vs Performance Trade-off",
  "ACID — Atomicity via WAL",
  "ACID — Consistency via Constraints",
  "ACID — Isolation via Locking/MVCC",
  "ACID — Durability via fsync",
  "Locking vs MVCC — Read/Write Blocking Behavior",
  "Locking vs MVCC — Snapshot Visibility",
  "Isolation Levels — Dirty Read",
  "Isolation Levels — Non-Repeatable Read",
  "Isolation Levels — Phantom Read",
];

async function main() {
  const userId = "NEERAJ04";

  console.log(`Updating progress for user: ${userId}`);

  for (const title of checkedTitles) {
    const item = await prisma.sDItem.findFirst({
      where: { title },
    });

    if (item) {
      await prisma.userSDItem.upsert({
        where: {
          userId_sdItemId: {
            userId: userId,
            sdItemId: item.id,
          },
        },
        update: {
          done: true,
          completedOn: new Date(),
        },
        create: {
          userId: userId,
          sdItemId: item.id,
          done: true,
          completedOn: new Date(),
        },
      });
      console.log(`✅ Marked as done: ${title}`);
    } else {
      console.warn(`❌ Item not found in DB: ${title}`);
    }
  }

  // Next, explicitly mark the UNCHECKED titles as not done in case they were previously checked.
  // Getting all SD items that are NOT in the checkedTitles list:
  const uncheckedItems = await prisma.sDItem.findMany({
    where: {
      title: { notIn: checkedTitles }
    }
  });

  for (const item of uncheckedItems) {
    // Upsert as not done
    await prisma.userSDItem.upsert({
      where: {
        userId_sdItemId: {
          userId: userId,
          sdItemId: item.id,
        },
      },
      update: {
        done: false,
        completedOn: null,
      },
      create: {
        userId: userId,
        sdItemId: item.id,
        done: false,
        completedOn: null,
      },
    });
  }
  console.log(`Unmarked ${uncheckedItems.length} items as not done.`);

  console.log("Done updating progress.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
