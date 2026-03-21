import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const patterns = [
  { name: "Monotonic Stack", slug: "monotonic-stack", icon: "SquareStack" },
  { name: "Prefix Sum", slug: "prefix-sum", icon: "PlusCircle" },
  { name: "Kadane’s Algorithm", slug: "kadanes-algorithm", icon: "Activity" },
  { name: "Binary Search", slug: "binary-search", icon: "Search" },
  { name: "Binary Search on Answer", slug: "binary-search-on-answer", icon: "Target" },
  { name: "Heap / Priority Queue", slug: "heap-priority-queue", icon: "SortAsc" },
  { name: "Top K Elements", slug: "top-k-elements", icon: "TrendingUp" },
  { name: "Two Heaps", slug: "two-heaps", icon: "GitCompare" },
  { name: "K-way Merge", slug: "k-way-merge", icon: "GitMerge" },
  { name: "Backtracking", slug: "backtracking", icon: "Undo2" },
  { name: "Subsets", slug: "subsets", icon: "Copy" },
  { name: "Permutations", slug: "permutations", icon: "RefreshCw" },
  { name: "Combinations / Combination Sum", slug: "combinations-combination-sum", icon: "Coins" },
  { name: "Tree BFS", slug: "tree-bfs", icon: "Network" },
  { name: "Tree DFS", slug: "tree-dfs", icon: "GitBranch" },
  { name: "Lowest Common Ancestor", slug: "lowest-common-ancestor", icon: "ArrowUpRight" },
  { name: "Graph BFS", slug: "graph-bfs", icon: "Share2" },
  { name: "Graph DFS", slug: "graph-dfs", icon: "Spline" },
  { name: "Topological Sort", slug: "topological-sort", icon: "ListOrdered" },
  { name: "Union Find (Disjoint Set)", slug: "union-find", icon: "Link" },
  { name: "Shortest Path – Dijkstra", slug: "shortest-path-dijkstra", icon: "Map" },
  { name: "Minimum Spanning Tree (Kruskal / Prim)", slug: "minimum-spanning-tree", icon: "Route" },
  { name: "Greedy", slug: "greedy", icon: "Trophy" },
  { name: "Dynamic Programming – 1D", slug: "dynamic-programming-1d", icon: "Hash" },
  { name: "0/1 Knapsack", slug: "knapsack", icon: "ShoppingBag" },
  { name: "Dynamic Programming – Grid / 2D", slug: "dynamic-programming-2d", icon: "Grid" },
  { name: "Longest Increasing Subsequence (LIS)", slug: "lis", icon: "StepForward" },
  { name: "Longest Common Subsequence (LCS)", slug: "lcs", icon: "Repeat" },
  { name: "Bit Manipulation (XOR / Bitmasking)", slug: "bit-manipulation", icon: "Cpu" },
  { name: "Trie", slug: "trie", icon: "Database" },
  { name: "String Pattern Matching (KMP / Rabin–Karp)", slug: "string-pattern-matching", icon: "Type" },
];

async function main() {
  console.log("🎨 Syncing Pattern Icons...");
  for (const p of patterns) {
    await prisma.pattern.upsert({
      where: { slug: p.slug },
      update: { icon: p.icon },
      create: p,
    });
  }
  console.log("✅ Patterns synced!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
