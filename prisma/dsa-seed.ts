import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const userId = "NEERAJ04";

  console.log("🚀 Starting DSA Expansion Seed...");

  // 1. CYCLIC SORT
  const cyclicSort = await prisma.pattern.upsert({
    where: { slug: "cyclic-sort" },
    update: {},
    create: { name: "Cyclic Sort", slug: "cyclic-sort", icon: "RefreshCw" },
  });

  const cyclicProblems = [
    { title: "Missing Number", url: "https://leetcode.com/problems/missing-number/", difficulty: "Easy", done: true },
    { title: "Find All Numbers Disappeared in an Array", url: "https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/", difficulty: "Easy", done: true },
    { title: "Find the Duplicate Number", url: "https://leetcode.com/problems/find-the-duplicate-number/", difficulty: "Easy", done: true },
    { title: "Set Mismatch", url: "https://leetcode.com/problems/set-mismatch/", difficulty: "Easy", done: true },
    { title: "Find All Duplicates in an Array", url: "https://leetcode.com/problems/find-all-duplicates-in-an-array/", difficulty: "Easy", done: true },
    { title: "First Missing Positive", url: "https://leetcode.com/problems/first-missing-positive/", difficulty: "Medium", done: true },
    { title: "Find the Smallest Missing Positive Number", url: "https://www.geeksforgeeks.org/find-the-smallest-positive-number-missing-from-an-unsorted-array/", difficulty: "Medium", done: true },
    { title: "Find the Corrupt Pair (Duplicate + Missing)", url: "https://www.geeksforgeeks.org/find-a-repeating-and-a-missing-number/", difficulty: "Medium", done: true },
    { title: "Find All Missing Numbers (1..n)", url: "https://www.geeksforgeeks.org/find-all-missing-numbers-from-a-given-array/", difficulty: "Medium", done: true },
    { title: "Cyclically Sort an Array", url: "https://www.geeksforgeeks.org/cyclic-sort/", difficulty: "Medium", done: true },
    { title: "Find the First K Missing Positive Numbers", url: "https://www.educative.io/courses/grokking-the-coding-interview/find-the-first-k-missing-positive-numbers", difficulty: "Medium", done: false },
    { title: "K Missing Positive Numbers", url: "https://www.geeksforgeeks.org/find-first-k-missing-positive-numbers/", difficulty: "Medium", done: false },
    { title: "Find Duplicate and Missing Number", url: "https://www.geeksforgeeks.org/find-a-repeating-and-a-missing-number/", difficulty: "Medium", done: false },
    { title: "Smallest Missing Number in Sorted Array", url: "https://www.geeksforgeeks.org/find-the-first-missing-number/", difficulty: "Medium", done: false },
    { title: "Find Missing Number in 0..n Range", url: "https://www.geeksforgeeks.org/find-the-missing-number/", difficulty: "Medium", done: false },
    { title: "First Missing Positive (Strict Constraints)", url: "https://leetcode.com/problems/first-missing-positive/", difficulty: "Hard", done: false },
    { title: "Find K Missing Positive Numbers (Large Input)", url: "https://www.educative.io/courses/grokking-the-coding-interview/find-the-first-k-missing-positive-numbers", difficulty: "Hard", done: false },
    { title: "Find All Corrupt Pairs", url: "https://www.educative.io/courses/grokking-the-coding-interview/find-the-corrupt-pair", difficulty: "Hard", done: false },
    { title: "Smallest Missing Positive After Rearrangement", url: "https://www.geeksforgeeks.org/find-the-smallest-positive-number-missing-from-an-unsorted-array/", difficulty: "Hard", done: false },
    { title: "Multiple Missing and Duplicate Elements", url: "https://www.geeksforgeeks.org/find-all-missing-and-repeating-elements/", difficulty: "Hard", done: false },
  ];

  // 2. IN-PLACE REVERSAL OF A LINKED LIST
  const linkedListReversal = await prisma.pattern.upsert({
    where: { slug: "linked-list-reversal" },
    update: {},
    create: { name: "In-place Reversal of a Linked List", slug: "linked-list-reversal", icon: "Link" },
  });

  const linkedListProblems = [
    { title: "Reverse Linked List", url: "https://leetcode.com/problems/reverse-linked-list/", difficulty: "Easy", done: true },
    { title: "Reverse Linked List II", url: "https://leetcode.com/problems/reverse-linked-list-ii/", difficulty: "Medium", done: true },
    { title: "Swap Nodes in Pairs", url: "https://leetcode.com/problems/swap-nodes-in-pairs/", difficulty: "Medium", done: true },
    { title: "Reverse Nodes in k-Group", url: "https://leetcode.com/problems/reverse-nodes-in-k-group/", difficulty: "Hard", done: true },
    { title: "Reverse Nodes in Even Length Groups", url: "https://leetcode.com/problems/reverse-nodes-in-even-length-groups/", difficulty: "Medium", done: true },
  ];

  // 3. STACK / MONOTONIC STACK (Baseball Game & extended)
  const stackPattern = await prisma.pattern.upsert({
    where: { slug: "monotonic-stack" },
    update: { name: "Stack & Monotonic Stack" },
    create: { name: "Stack & Monotonic Stack", slug: "monotonic-stack", icon: "Layers" },
  });

  const stackProblems = [
    { title: "Baseball Game", url: "https://leetcode.com/problems/baseball-game/", difficulty: "Easy", done: false },
    { title: "Backspace String Compare", url: "https://leetcode.com/problems/backspace-string-compare/", difficulty: "Easy", done: false },
    { title: "Buildings With an Ocean View", url: "https://leetcode.com/problems/buildings-with-an-ocean-view/", difficulty: "Medium", done: false },
    { title: "Final Prices With a Special Discount in a Shop", url: "https://leetcode.com/problems/final-prices-with-a-special-discount-in-a-shop/", difficulty: "Easy", done: false },
    { title: "Make The String Great", url: "https://leetcode.com/problems/make-the-string-great/", difficulty: "Easy", done: false },
    { title: "Asteroid Collision", url: "https://leetcode.com/problems/asteroid-collision/", difficulty: "Medium", done: false },
    { title: "Maximal Rectangle", url: "https://leetcode.com/problems/maximal-rectangle/", difficulty: "Hard", done: false },
    { title: "132 Pattern", url: "https://leetcode.com/problems/132-pattern/", difficulty: "Medium", done: false },
    { title: "Online Stock Span", url: "https://leetcode.com/problems/online-stock-span/", difficulty: "Medium", done: false },
    { title: "Score of a String", url: "https://leetcode.com/problems/score-of-a-string/", difficulty: "Easy", done: false },
    { title: "Minimum Cost Tree From Leaf Values", url: "https://leetcode.com/problems/minimum-cost-tree-from-leaf-values/", difficulty: "Medium", done: false },
    { title: "Minimum Add to Make Parentheses Valid", url: "https://leetcode.com/problems/minimum-add-to-make-parentheses-valid/", difficulty: "Medium", done: false },
    { title: "Remove K Digits", url: "https://leetcode.com/problems/remove-k-digits/", difficulty: "Medium", done: false },
    { title: "Car Fleet", url: "https://leetcode.com/problems/car-fleet/", difficulty: "Medium", done: false },
    { title: "Crawler Log Folder", url: "https://leetcode.com/problems/crawler-log-folder/", difficulty: "Easy", done: false },
    { title: "Number of Visible People in a Queue", url: "https://leetcode.com/problems/number-of-visible-people-in-a-queue/", difficulty: "Hard", done: false },
    { title: "Car Fleet II", url: "https://leetcode.com/problems/car-fleet-ii/", difficulty: "Hard", done: false },
    { title: "Next Greater Element II", url: "https://leetcode.com/problems/next-greater-element-ii/", difficulty: "Medium", done: false },
    { title: "Daily Temperatures", url: "https://leetcode.com/problems/daily-temperatures/", difficulty: "Medium", done: false },
    { title: "Remove Outermost Parentheses", url: "https://leetcode.com/problems/remove-outermost-parentheses/", difficulty: "Easy", done: false },
    { title: "Sum of Subarray Minimums", url: "https://leetcode.com/problems/sum-of-subarray-minimums/", difficulty: "Medium", done: false },
    { title: "Largest Rectangle in Histogram", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/", difficulty: "Hard", done: false },
    { title: "Sum of Subarray Ranges", url: "https://leetcode.com/problems/sum-of-subarray-ranges/", difficulty: "Medium", done: false },
    { title: "Next Greater Element I", url: "https://leetcode.com/problems/next-greater-element-i/", difficulty: "Easy", done: false },
    { title: "Minimum String Length After Removing Substrings", url: "https://leetcode.com/problems/minimum-string-length-after-removing-substrings/", difficulty: "Easy", done: false },
  ];

  // 4. MERGE INTERVALS
  const mergeIntervals = await prisma.pattern.upsert({
    where: { slug: "merge-intervals" },
    update: {},
    create: { name: "Merge Intervals", slug: "merge-intervals", icon: "GitMerge" },
  });

  const mergeIntervalsProblems = [
    { title: "Can Attend All Meetings (variant)", url: "https://www.geeksforgeeks.org/check-if-any-two-intervals-overlap-among-a-given-set-of-intervals/", difficulty: "Easy", done: true },
    { title: "Interval List Intersections", url: "https://leetcode.com/problems/interval-list-intersections/", difficulty: "Easy", done: true },
    { title: "Meeting Rooms", url: "https://leetcode.com/problems/meeting-rooms/", difficulty: "Easy", done: false },
    { title: "Merge Two Intervals (GFG variant)", url: "https://www.geeksforgeeks.org/merging-intervals/", difficulty: "Easy", done: true },
    { title: "Remove Covered Intervals", url: "https://leetcode.com/problems/remove-covered-intervals/", difficulty: "Easy", done: false },
    { title: "Car Pooling", url: "https://leetcode.com/problems/car-pooling/", difficulty: "Medium", done: false },
    { title: "Data Stream as Disjoint Intervals", url: "https://leetcode.com/problems/data-stream-as-disjoint-intervals/", difficulty: "Medium", done: false },
    { title: "Describe the Painting", url: "https://leetcode.com/problems/describe-the-painting/", difficulty: "Medium", done: false },
    { title: "Divide Intervals into Minimum Number", url: "https://leetcode.com/problems/divide-intervals-into-minimum-number-of-groups/", difficulty: "Medium", done: false },
    { title: "Insert Interval", url: "https://leetcode.com/problems/insert-interval/", difficulty: "Medium", done: true },
    { title: "Interval Coverage Variants", url: "#", difficulty: "Medium", done: false },
    { title: "Meeting Rooms II", url: "https://leetcode.com/problems/meeting-rooms-ii/", difficulty: "Medium", done: false },
    { title: "Merge Intervals", url: "https://leetcode.com/problems/merge-intervals/", difficulty: "Medium", done: true },
    { title: "Minimum Number of Arrows to Burst Balloons", url: "https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/", difficulty: "Medium", done: false },
    { title: "My Calendar I", url: "https://leetcode.com/problems/my-calendar-i/", difficulty: "Medium", done: false },
    { title: "My Calendar II", url: "https://leetcode.com/problems/my-calendar-ii/", difficulty: "Medium", done: false },
    { title: "Non-overlapping Intervals", url: "https://leetcode.com/problems/non-overlapping-intervals/", difficulty: "Medium", done: false },
    { title: "Range Module (Medium)", url: "https://leetcode.com/problems/range-module/m", difficulty: "Medium", done: false },
    { title: "Remove Interval", url: "https://leetcode.com/problems/remove-interval/", difficulty: "Medium", done: false },
    { title: "Set Intersection Size At Least Two", url: "https://leetcode.com/problems/set-intersection-size-at-least-two/", difficulty: "Medium", done: false },
    { title: "Data Stream as Disjoint Intervals (Hard)", url: "https://leetcode.com/problems/data-stream-as-disjoint-intervals/h", difficulty: "Hard", done: false },
    { title: "Employee Free Time", url: "https://leetcode.com/problems/employee-free-time/", difficulty: "Hard", done: false },
    { title: "Falling Squares", url: "https://leetcode.com/problems/falling-squares/", difficulty: "Hard", done: false },
    { title: "My Calendar III", url: "https://leetcode.com/problems/my-calendar-iii/", difficulty: "Hard", done: false },
    { title: "Range Module (Hard)", url: "https://leetcode.com/problems/range-module/", difficulty: "Hard", done: false },
  ];

  // 5. FAST & SLOW POINTERS
  const fastSlowPointers = await prisma.pattern.upsert({
    where: { slug: "fast-slow-pointers" },
    update: {},
    create: { name: "Fast & Slow Pointers", slug: "fast-slow-pointers", icon: "Zap" },
  });

  const fastSlowProblems = [
    { title: "Circular Array Loop", url: "https://leetcode.com/problems/circular-array-loop/", difficulty: "Easy", done: true },
    { title: "Happy Number", url: "https://leetcode.com/problems/happy-number/", difficulty: "Easy", done: true },
    { title: "Intersection of Two Linked Lists", url: "https://leetcode.com/problems/intersection-of-two-linked-lists/", difficulty: "Easy", done: true },
    { title: "Linked List Cycle", url: "https://leetcode.com/problems/linked-list-cycle/", difficulty: "Easy", done: true },
    { title: "Merge Two Sorted Lists", url: "https://leetcode.com/problems/merge-two-sorted-lists/", difficulty: "Easy", done: true },
    { title: "Middle of the Linked List", url: "https://leetcode.com/problems/middle-of-the-linked-list/", difficulty: "Easy", done: true },
    { title: "Palindrome Linked List", url: "https://leetcode.com/problems/palindrome-linked-list/", difficulty: "Easy", done: true },
    { title: "Remove Linked List Elements", url: "https://leetcode.com/problems/remove-linked-list-elements/", difficulty: "Easy", done: true },
    { title: "Reverse Linked List", url: "https://leetcode.com/problems/reverse-linked-list/fs", difficulty: "Easy", done: true },
  ];

  // 6. TWO POINTERS (Expanded)
  const twoPointers = await prisma.pattern.upsert({
    where: { slug: "two-pointers" },
    update: {},
    create: { name: "Two Pointers", slug: "two-pointers", icon: "ArrowLeftRight" },
  });

  const twoPointersProblems = [
    { title: "Two Sum II - Input Array Is Sorted", url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/", difficulty: "Easy", done: true },
    { title: "Remove Duplicates from Sorted Array", url: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/", difficulty: "Easy", done: true },
    { title: "Move Zeroes", url: "https://leetcode.com/problems/move-zeroes/", difficulty: "Easy", done: true },
    { title: "Reverse String", url: "https://leetcode.com/problems/reverse-string/", difficulty: "Easy", done: true },
    { title: "Valid Palindrome", url: "https://leetcode.com/problems/valid-palindrome/", difficulty: "Easy", done: true },
    { title: "Partition Labels", url: "https://leetcode.com/problems/partition-labels/", difficulty: "Medium", done: true },
    { title: "Boats to Save People", url: "https://leetcode.com/problems/boats-to-save-people/", difficulty: "Medium", done: true },
    { title: "Minimum Size Subarray Sum", url: "https://leetcode.com/problems/minimum-size-subarray-sum/", difficulty: "Medium", done: false },
    { title: "Find the Duplicate Number", url: "https://leetcode.com/problems/find-the-duplicate-number/tp", difficulty: "Medium", done: true },
    { title: "Squares of a Sorted Array", url: "https://leetcode.com/problems/squares-of-a-sorted-array/", difficulty: "Medium", done: false },
    { title: "Container With Most Water", url: "https://leetcode.com/problems/container-with-most-water/", difficulty: "Medium", done: true },
    { title: "3Sum Closest", url: "https://leetcode.com/problems/3sum-closest/", difficulty: "Medium", done: true },
    { title: "Sort Colors", url: "https://leetcode.com/problems/sort-colors/", difficulty: "Medium", done: true },
    { title: "3Sum", url: "https://leetcode.com/problems/3sum/", difficulty: "Medium", done: true },
    { title: "Remove Duplicates from Sorted Array I", url: "https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/", difficulty: "Medium", done: false },
    { title: "Minimum Window Substring", url: "https://leetcode.com/problems/minimum-window-substring/tp", difficulty: "Hard", done: false },
    { title: "Substring with Concatenation of All Words", url: "https://leetcode.com/problems/substring-with-concatenation-of-all-words/", difficulty: "Hard", done: false },
    { title: "Trapping Rain Water", url: "https://leetcode.com/problems/trapping-rain-water/tp", difficulty: "Hard", done: false },
    { title: "Shortest Subarray with Sum at Least K", url: "https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/", difficulty: "Hard", done: false },
    { title: "Max Value of Equation", url: "https://leetcode.com/problems/max-value-of-equation/", difficulty: "Hard", done: false },
  ];

  const allProblemSets = [
    { patternId: cyclicSort.id, problems: cyclicProblems, tag: "Cyclic Sort" },
    { patternId: linkedListReversal.id, problems: linkedListProblems, tag: "Linked List" },
    { patternId: stackPattern.id, problems: stackProblems, tag: "Stack" },
    { patternId: mergeIntervals.id, problems: mergeIntervalsProblems, tag: "Merge Intervals" },
    { patternId: fastSlowPointers.id, problems: fastSlowProblems, tag: "Fast & Slow Pointers" },
    { patternId: twoPointers.id, problems: twoPointersProblems, tag: "Two Pointers" },
  ];

  for (const set of allProblemSets) {
    let srNo = 1;
    // For Two Pointers, we might want to reset srNo or just keep incrementing if we are not clearing.
    // Given the previous run, we should be careful not to keep appending endlessly.
    // For now, let's just use the index in the array as srNo for consistency with the prompt.
    
    for (const p of set.problems) {
      // Find existing problem by URL
      let problem = await prisma.problem.findFirst({
        where: { url: p.url },
      });

      if (problem) {
        // Update existing problem
        problem = await prisma.problem.update({
          where: { id: problem.id },
          data: {
            title: p.title,
            difficulty: p.difficulty,
            srNo: srNo++,
          },
        });
      } else {
        // Create new problem
        problem = await prisma.problem.create({
          data: {
            title: p.title,
            url: p.url,
            difficulty: p.difficulty,
            srNo: srNo++,
            patternId: set.patternId,
            tags: JSON.stringify([set.tag]),
          },
        });
      }

      if (p.done) {
        await prisma.userProblem.upsert({
          where: { userId_problemId: { userId, problemId: problem.id } },
          update: { done: true, solvedOn: new Date() },
          create: { userId, problemId: problem.id, done: true, solvedOn: new Date() },
        });
      }
    }
  }

  console.log("✅ DSA Expansion Seed Completed!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
