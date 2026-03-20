import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.activityLog.deleteMany();
  await prisma.userProblem.deleteMany();
  await prisma.problem.deleteMany();
  await prisma.pattern.deleteMany();
  await prisma.broadcast.deleteMany();
  await prisma.user.deleteMany();

  const monoStack = await prisma.pattern.create({
    data: { name: "Monotonic Stack", slug: "monotonic-stack", icon: "Layers" },
  });

  await prisma.problem.createMany({
    data: [
      { srNo: 1, title: "Next Greater Element I", url: "https://leetcode.com/problems/next-greater-element-i/", difficulty: "Easy", tags: JSON.stringify(["Monotonic Stack"]), patternId: monoStack.id },
      { srNo: 2, title: "Daily Temperatures", url: "https://leetcode.com/problems/daily-temperatures/", difficulty: "Medium", tags: JSON.stringify(["Monotonic Stack"]), patternId: monoStack.id },
      { srNo: 3, title: "Largest Rectangle in Histogram", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/", difficulty: "Medium", tags: JSON.stringify(["Monotonic Stack", "DP"]), patternId: monoStack.id },
      { srNo: 4, title: "Online Stock Span", url: "https://leetcode.com/problems/online-stock-span/", difficulty: "Medium", tags: JSON.stringify(["Monotonic Stack"]), patternId: monoStack.id },
      { srNo: 5, title: "Sum of Subarray Minimums", url: "https://leetcode.com/problems/sum-of-subarray-minimums/", difficulty: "Medium", tags: JSON.stringify(["Monotonic Stack", "DP"]), patternId: monoStack.id },
    ],
  });

  const twoPointers = await prisma.pattern.create({
    data: { name: "Two Pointers", slug: "two-pointers", icon: "ArrowLeftRight" },
  });

  await prisma.problem.createMany({
    data: [
      { srNo: 1, title: "Valid Palindrome", url: "https://leetcode.com/problems/valid-palindrome/", difficulty: "Easy", tags: JSON.stringify(["Two Pointers", "String"]), patternId: twoPointers.id },
      { srNo: 2, title: "Two Sum II", url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/", difficulty: "Medium", tags: JSON.stringify(["Two Pointers"]), patternId: twoPointers.id },
      { srNo: 3, title: "Container With Most Water", url: "https://leetcode.com/problems/container-with-most-water/", difficulty: "Medium", tags: JSON.stringify(["Two Pointers", "Greedy"]), patternId: twoPointers.id },
      { srNo: 4, title: "3Sum", url: "https://leetcode.com/problems/3sum/", difficulty: "Medium", tags: JSON.stringify(["Two Pointers"]), patternId: twoPointers.id },
      { srNo: 5, title: "Trapping Rain Water", url: "https://leetcode.com/problems/trapping-rain-water/", difficulty: "Hard", tags: JSON.stringify(["Two Pointers", "DP", "Monotonic Stack"]), patternId: twoPointers.id },
    ],
  });

  const slidingWindow = await prisma.pattern.create({
    data: { name: "Sliding Window", slug: "sliding-window", icon: "SlidersHorizontal" },
  });

  await prisma.problem.createMany({
    data: [
      { srNo: 1, title: "Best Time to Buy and Sell Stock", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", difficulty: "Easy", tags: JSON.stringify(["Sliding Window"]), patternId: slidingWindow.id },
      { srNo: 2, title: "Longest Substring Without Repeating Characters", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", difficulty: "Medium", tags: JSON.stringify(["Sliding Window", "String"]), patternId: slidingWindow.id },
      { srNo: 3, title: "Minimum Window Substring", url: "https://leetcode.com/problems/minimum-window-substring/", difficulty: "Hard", tags: JSON.stringify(["Sliding Window", "String"]), patternId: slidingWindow.id },
      { srNo: 4, title: "Permutation in String", url: "https://leetcode.com/problems/permutation-in-string/", difficulty: "Medium", tags: JSON.stringify(["Sliding Window", "String"]), patternId: slidingWindow.id },
      { srNo: 5, title: "Sliding Window Maximum", url: "https://leetcode.com/problems/sliding-window-maximum/", difficulty: "Hard", tags: JSON.stringify(["Sliding Window", "Monotonic Stack"]), patternId: slidingWindow.id },
    ],
  });

  await prisma.broadcast.create({
    data: { message: "Welcome to GrindMap! Start tracking your DSA progress today.", active: true },
  });

  console.log("✅ Seed completed: 3 patterns, 15 problems, 1 broadcast");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
