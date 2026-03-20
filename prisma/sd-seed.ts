import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface SeedItem {
  title: string;
  url: string;
  type: string;
  difficulty: string;
}

interface SeedTopic {
  name: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
  items: SeedItem[];
}

const topics: SeedTopic[] = [
  // ════════════════════════════════════════════
  // 1️⃣ DATABASES
  // ════════════════════════════════════════════
  {
    name: "Databases",
    slug: "databases",
    description: "Relational, NoSQL, Replication, Sharding, ACID, Indexing",
    icon: "Database",
    order: 1,
    items: [
      // Relational Databases
      { title: "Relational Databases — Fundamentals", url: "https://www.youtube.com/watch?v=OqjJjpjDRLc", type: "Video", difficulty: "Easy" },
      // B+ Tree Indexing
      { title: "B+ Tree Indexing — Node Structure (Internal vs Leaf)", url: "https://www.youtube.com/watch?v=aZjYr87r1b8", type: "Video", difficulty: "Medium" },
      { title: "B+ Tree — Branching Factor", url: "https://use-the-index-luke.com/sql/anatomy/the-tree", type: "Article", difficulty: "Medium" },
      { title: "B+ Tree — Disk I/O Reduction Logic", url: "https://www.youtube.com/watch?v=UzHl2VzyZS4", type: "Video", difficulty: "Hard" },
      // Clustered vs Non-Clustered Index
      { title: "Clustered vs Non-Clustered Index — Storage Layout", url: "https://www.youtube.com/watch?v=ITcOiLSfVJQ", type: "Video", difficulty: "Medium" },
      { title: "Clustered vs Non-Clustered — Performance Implications", url: "https://use-the-index-luke.com/sql/clustering/index-organized-clustered-index", type: "Article", difficulty: "Medium" },
      // Covering Index
      { title: "Covering Index — Index-Only Scan", url: "https://www.youtube.com/watch?v=HubezKbFL7E", type: "Video", difficulty: "Medium" },
      { title: "Covering Index — When It Avoids Table Lookup", url: "https://use-the-index-luke.com/sql/clustering/index-only-scan", type: "Article", difficulty: "Medium" },
      // Query Execution Plan
      { title: "Query Execution Plan — Reading EXPLAIN Output", url: "https://www.youtube.com/watch?v=MYMFqwKqhyA", type: "Video", difficulty: "Medium" },
      { title: "Identifying Full Table Scan vs Index Scan", url: "https://planetscale.com/learn/courses/mysql-for-developers/queries/explain", type: "Article", difficulty: "Medium" },
      // WAL
      { title: "Write-Ahead Logging (WAL) — Log-First Write Principle", url: "https://www.youtube.com/watch?v=wI4hKwl1Cn4", type: "Video", difficulty: "Hard" },
      { title: "WAL — Crash Recovery Flow", url: "https://www.postgresql.org/docs/current/wal-intro.html", type: "Article", difficulty: "Hard" },
      // Checkpointing
      { title: "Checkpointing — Why Checkpoints Exist", url: "https://www.youtube.com/watch?v=LOv4av6e8xA", type: "Video", difficulty: "Hard" },
      { title: "Checkpointing — Frequency vs Performance Trade-off", url: "https://www.postgresql.org/docs/current/wal-configuration.html", type: "Article", difficulty: "Hard" },
      // ACID (Implementation Level)
      { title: "ACID — Atomicity via WAL", url: "https://www.youtube.com/watch?v=pomxJOFVcQs", type: "Video", difficulty: "Medium" },
      { title: "ACID — Consistency via Constraints", url: "https://www.youtube.com/watch?v=yaQ5YMWkxq4", type: "Video", difficulty: "Easy" },
      { title: "ACID — Isolation via Locking/MVCC", url: "https://www.youtube.com/watch?v=4EajrPgJAk0", type: "Video", difficulty: "Hard" },
      { title: "ACID — Durability via fsync", url: "https://www.youtube.com/watch?v=9nSaTv_wa6c", type: "Video", difficulty: "Hard" },
      // Locking vs MVCC
      { title: "Locking vs MVCC — Read/Write Blocking Behavior", url: "https://www.youtube.com/watch?v=AkpmAKoy_O4", type: "Video", difficulty: "Hard" },
      { title: "Locking vs MVCC — Snapshot Visibility", url: "https://blog.bytebytego.com/p/mvcc-multi-version-concurrency-control", type: "Article", difficulty: "Hard" },
      // Isolation Levels
      { title: "Isolation Levels — Dirty Read", url: "https://www.youtube.com/watch?v=4EajrPgJAk0", type: "Video", difficulty: "Medium" },
      { title: "Isolation Levels — Non-Repeatable Read", url: "https://blog.bytebytego.com/p/understanding-database-isolation-levels", type: "Article", difficulty: "Medium" },
      { title: "Isolation Levels — Phantom Read", url: "https://www.youtube.com/watch?v=FDOPm3jCs28", type: "Video", difficulty: "Medium" },
      // MVCC Mechanics
      { title: "MVCC — Version Chains", url: "https://www.youtube.com/watch?v=Bz-6Y-_navo", type: "Video", difficulty: "Hard" },
      { title: "MVCC — Snapshot Creation", url: "https://blog.bytebytego.com/p/mvcc-multi-version-concurrency-control", type: "Article", difficulty: "Hard" },
      { title: "MVCC — Snapshot Isolation", url: "https://jepsen.io/consistency/models/snapshot-isolation", type: "Article", difficulty: "Hard" },
      { title: "MVCC — Repeatable Read vs Serializable", url: "https://www.youtube.com/watch?v=de-fGi5EuNk", type: "Video", difficulty: "Hard" },
      { title: "MVCC — Write Skew Problem", url: "https://www.youtube.com/watch?v=wybjsKtA9hI", type: "Video", difficulty: "Hard" },
      // Replication
      { title: "Replication — Leader-Follower Architecture", url: "https://www.youtube.com/watch?v=bI8Ry6GhMSE", type: "Video", difficulty: "Medium" },
      { title: "Replication — Sync vs Async", url: "https://blog.bytebytego.com/p/database-replication-under-the-hood", type: "Article", difficulty: "Medium" },
      { title: "Replication — Replication Lag", url: "https://www.youtube.com/watch?v=RIcNswROzCc", type: "Video", difficulty: "Medium" },
      { title: "Replication — Read-After-Write Consistency", url: "https://blog.bytebytego.com/p/consistency-models-in-distributed", type: "Article", difficulty: "Hard" },
      { title: "Replication — Failover Process", url: "https://www.youtube.com/watch?v=pSoKUfLTe8Y", type: "Video", difficulty: "Hard" },
      // Scaling Databases
      { title: "Scaling — Vertical vs Horizontal", url: "https://www.youtube.com/watch?v=xpDnVSmNFX0", type: "Video", difficulty: "Easy" },
      { title: "Scaling — Read Replica Limits", url: "https://blog.bytebytego.com/p/how-to-scale-a-relational-database", type: "Article", difficulty: "Medium" },
      { title: "Scaling — Write Bottleneck", url: "https://www.youtube.com/watch?v=ztHopE5Wnpc", type: "Video", difficulty: "Medium" },
      { title: "Scaling — Cross-Region Replication Trade-offs", url: "https://blog.bytebytego.com/p/cross-region-replication-strategies", type: "Article", difficulty: "Hard" },
      { title: "Scaling — Strong vs Eventual Consistency", url: "https://www.youtube.com/watch?v=RY_2gElt3SA", type: "Video", difficulty: "Hard" },
      // Sharding / Partitioning
      { title: "Sharding — Range-Based Sharding", url: "https://www.youtube.com/watch?v=5faMjKn0xoo", type: "Video", difficulty: "Medium" },
      { title: "Sharding — Hash-Based Sharding", url: "https://www.youtube.com/watch?v=zaRkONvyGr8", type: "Video", difficulty: "Medium" },
      { title: "Sharding — Directory-Based Sharding", url: "https://blog.bytebytego.com/p/database-sharding-explained", type: "Article", difficulty: "Medium" },
      { title: "Sharding — Consistent Hashing", url: "https://www.youtube.com/watch?v=UF9Eri9Z1kc", type: "Video", difficulty: "Hard" },
      { title: "Sharding — Rebalancing Strategy", url: "https://blog.bytebytego.com/p/consistent-hashing-explained", type: "Article", difficulty: "Hard" },
      { title: "Sharding — Hot Partition Issue", url: "https://www.youtube.com/watch?v=P6SZY46Cj0w", type: "Video", difficulty: "Hard" },
      { title: "Sharding — Cross-Shard Joins", url: "https://blog.bytebytego.com/p/challenges-in-database-sharding", type: "Article", difficulty: "Hard" },
      { title: "Sharding — Global Secondary Indexes", url: "https://aws.amazon.com/blogs/database/tag/global-secondary-index/", type: "Article", difficulty: "Hard" },
      // NoSQL
      { title: "NoSQL — Key-Value Stores", url: "https://www.youtube.com/watch?v=W2Z7fbCLSTw", type: "Video", difficulty: "Easy" },
      { title: "NoSQL — Document Databases", url: "https://www.youtube.com/watch?v=EE8ZTQxa0AM", type: "Video", difficulty: "Easy" },
      { title: "NoSQL — Column Stores", url: "https://www.youtube.com/watch?v=Vw1fCeD06YI", type: "Video", difficulty: "Medium" },
      { title: "NoSQL — Graph Databases", url: "https://www.youtube.com/watch?v=REVkXVxvMQE", type: "Video", difficulty: "Medium" },
      { title: "NoSQL — When to Prefer Each", url: "https://blog.bytebytego.com/p/how-to-choose-the-right-database", type: "Article", difficulty: "Medium" },
      { title: "NoSQL — Denormalization Trade-offs", url: "https://www.youtube.com/watch?v=Q_9cFgzZr8Q", type: "Video", difficulty: "Medium" },
      { title: "NoSQL — Eventual Consistency Behavior", url: "https://blog.bytebytego.com/p/eventual-consistency-is-not-your-enemy", type: "Article", difficulty: "Hard" },
      { title: "NoSQL — Secondary Index Limitations", url: "https://www.youtube.com/watch?v=DqaYWfFGzPA", type: "Video", difficulty: "Hard" },
      // Multi-Leader & Split Brain
      { title: "Multi-Leader Conflicts", url: "https://www.youtube.com/watch?v=iHNovZUZM3A", type: "Video", difficulty: "Hard" },
      { title: "Split Brain Problem", url: "https://blog.bytebytego.com/p/what-is-split-brain", type: "Article", difficulty: "Hard" },
    ],
  },

  // ════════════════════════════════════════════
  // 2️⃣ CACHING
  // ════════════════════════════════════════════
  {
    name: "Caching",
    slug: "caching",
    description: "Patterns, TTL, Eviction, Consistency, Redis Internals",
    icon: "Zap",
    order: 2,
    items: [
      // Core Patterns
      { title: "Cache-Aside Pattern", url: "https://www.youtube.com/watch?v=TpRi95q3aHc", type: "Video", difficulty: "Easy" },
      { title: "Write-Through Cache", url: "https://blog.bytebytego.com/p/caching-patterns", type: "Article", difficulty: "Medium" },
      { title: "Write-Back Cache", url: "https://www.youtube.com/watch?v=DUbEgNw-F9c", type: "Video", difficulty: "Medium" },
      { title: "Write-Around Cache", url: "https://blog.bytebytego.com/p/caching-patterns", type: "Article", difficulty: "Medium" },
      { title: "Cache Warming", url: "https://www.youtube.com/watch?v=gGdMj_W30SA", type: "Video", difficulty: "Easy" },
      // TTL & Eviction
      { title: "TTL Strategy Design", url: "https://blog.bytebytego.com/p/a-crash-course-in-caching", type: "Article", difficulty: "Medium" },
      { title: "Eviction — LRU", url: "https://www.youtube.com/watch?v=S6IfqDXWa10", type: "Video", difficulty: "Medium" },
      { title: "Eviction — LFU", url: "https://www.youtube.com/watch?v=0OQB-CE6HcE", type: "Video", difficulty: "Medium" },
      { title: "Eviction — FIFO and Random", url: "https://blog.bytebytego.com/p/cache-eviction-policies", type: "Article", difficulty: "Easy" },
      { title: "Eviction — Memory Fragmentation", url: "https://redis.io/docs/management/optimization/memory-optimization/", type: "Article", difficulty: "Hard" },
      // Consistency
      { title: "Cache Invalidation Strategies", url: "https://www.youtube.com/watch?v=OqVlyZi2gIE", type: "Video", difficulty: "Medium" },
      { title: "Double Delete Pattern", url: "https://blog.bytebytego.com/p/how-to-keep-cache-consistent-with", type: "Article", difficulty: "Hard" },
      { title: "Stale Data Window", url: "https://www.youtube.com/watch?v=OqVlyZi2gIE", type: "Video", difficulty: "Medium" },
      { title: "Read-After-Write Inconsistency", url: "https://blog.bytebytego.com/p/how-to-keep-cache-consistent-with", type: "Article", difficulty: "Hard" },
      // Failure Scenarios
      { title: "Cache Stampede / Thundering Herd", url: "https://www.youtube.com/watch?v=xoHrsCOS7Ug", type: "Video", difficulty: "Hard" },
      { title: "Hot Key Problem", url: "https://blog.bytebytego.com/p/a-crash-course-in-caching", type: "Article", difficulty: "Hard" },
      { title: "Cache Penetration", url: "https://www.youtube.com/watch?v=k9LI2L6WwJI", type: "Video", difficulty: "Medium" },
      { title: "Cold Start Problem", url: "https://blog.bytebytego.com/p/a-crash-course-in-caching", type: "Article", difficulty: "Medium" },
      // Redis Internals
      { title: "Redis — Single-Threaded Event Loop", url: "https://www.youtube.com/watch?v=5TRFpFBccQM", type: "Video", difficulty: "Medium" },
      { title: "Redis — Why Redis Is Fast", url: "https://blog.bytebytego.com/p/why-is-redis-so-fast", type: "Article", difficulty: "Easy" },
      { title: "Redis — RDB Persistence", url: "https://www.youtube.com/watch?v=Hbt56gFj998", type: "Video", difficulty: "Medium" },
      { title: "Redis — AOF Persistence", url: "https://redis.io/docs/management/persistence/", type: "Article", difficulty: "Medium" },
      { title: "Redis — Replication Model", url: "https://www.youtube.com/watch?v=sEb_2W36jYg", type: "Video", difficulty: "Hard" },
      { title: "Redis — Sentinel", url: "https://redis.io/docs/management/sentinel/", type: "Article", difficulty: "Hard" },
      { title: "Redis — Cluster Mode & Slot-Based Sharding", url: "https://www.youtube.com/watch?v=N8BkmdZzxDg", type: "Video", difficulty: "Hard" },
    ],
  },

  // ════════════════════════════════════════════
  // 3️⃣ ASYNC PROCESSING
  // ════════════════════════════════════════════
  {
    name: "Async Processing",
    slug: "async-processing",
    description: "Messaging, Kafka Internals, Failure Modes",
    icon: "MessageSquare",
    order: 3,
    items: [
      // Messaging Fundamentals
      { title: "Messaging — At-Most-Once Delivery", url: "https://www.youtube.com/watch?v=WE9c9AZe-DY", type: "Video", difficulty: "Easy" },
      { title: "Messaging — At-Least-Once Delivery", url: "https://blog.bytebytego.com/p/at-most-once-at-least-once-exactly", type: "Article", difficulty: "Medium" },
      { title: "Messaging — Exactly-Once (Practical Meaning)", url: "https://www.youtube.com/watch?v=5_dFsogez2M", type: "Video", difficulty: "Hard" },
      { title: "Idempotency Patterns", url: "https://blog.bytebytego.com/p/idempotency-keys-how-payment-systems", type: "Article", difficulty: "Medium" },
      { title: "Dead Letter Queue", url: "https://www.youtube.com/watch?v=nFRgiSlwgX0", type: "Video", difficulty: "Medium" },
      { title: "Retry Strategies (Exponential Backoff)", url: "https://blog.bytebytego.com/p/retry-patterns-and-strategies", type: "Article", difficulty: "Medium" },
      { title: "Backpressure Handling", url: "https://www.youtube.com/watch?v=9-hZbP_6v4w", type: "Video", difficulty: "Hard" },
      // Kafka Internals
      { title: "Kafka — Topic Architecture", url: "https://www.youtube.com/watch?v=B5j3uNBH8X4", type: "Video", difficulty: "Medium" },
      { title: "Kafka — Partition Strategy & Key Selection", url: "https://blog.bytebytego.com/p/apache-kafka-crash-course", type: "Article", difficulty: "Medium" },
      { title: "Kafka — Ordering Guarantees", url: "https://www.youtube.com/watch?v=2pEpHPIe4Ec", type: "Video", difficulty: "Hard" },
      { title: "Kafka — Offset Management", url: "https://blog.bytebytego.com/p/apache-kafka-crash-course", type: "Article", difficulty: "Medium" },
      { title: "Kafka — Consumer Groups & Rebalancing", url: "https://www.youtube.com/watch?v=lAdG16KaHLs", type: "Video", difficulty: "Hard" },
      { title: "Kafka — ISR (In-Sync Replicas)", url: "https://blog.bytebytego.com/p/apache-kafka-crash-course", type: "Article", difficulty: "Hard" },
      { title: "Kafka — Leader Election", url: "https://www.youtube.com/watch?v=SRSfMOD-YYI", type: "Video", difficulty: "Hard" },
      { title: "Kafka — Retention Policies & Log Compaction", url: "https://www.youtube.com/watch?v=daRxuCand_8", type: "Video", difficulty: "Medium" },
      { title: "Kafka — Pull Model Rationale", url: "https://blog.bytebytego.com/p/why-does-kafka-use-a-pull-model", type: "Article", difficulty: "Medium" },
      // Failure Modes
      { title: "Producer Retry Duplication", url: "https://www.youtube.com/watch?v=5_dFsogez2M", type: "Video", difficulty: "Hard" },
      { title: "Consumer Crash Mid-Processing", url: "https://blog.bytebytego.com/p/how-to-handle-failures-in-message", type: "Article", difficulty: "Hard" },
      { title: "Broker Failure & Network Partition", url: "https://www.youtube.com/watch?v=udnX21__SeU", type: "Video", difficulty: "Hard" },
      { title: "Data Loss Scenarios", url: "https://blog.bytebytego.com/p/how-to-prevent-data-loss-in-kafka", type: "Article", difficulty: "Hard" },
    ],
  },

  // ════════════════════════════════════════════
  // 4️⃣ LOAD BALANCING & RESILIENCY
  // ════════════════════════════════════════════
  {
    name: "Load Balancing & Resiliency",
    slug: "load-balancing-resiliency",
    description: "Load Balancers, Circuit Breaker, Leader Election, Raft",
    icon: "Network",
    order: 4,
    items: [
      // Load Balancers
      { title: "Load Balancers — L4 vs L7", url: "https://www.youtube.com/watch?v=aKMLgFVxZYk", type: "Video", difficulty: "Medium" },
      { title: "LB — Round Robin & Least Connections", url: "https://www.youtube.com/watch?v=K0Ta65OqQkY", type: "Video", difficulty: "Easy" },
      { title: "LB — Consistent Hashing", url: "https://www.youtube.com/watch?v=UF9Eri9Z1kc", type: "Video", difficulty: "Hard" },
      { title: "LB — Health Checks", url: "https://blog.bytebytego.com/p/load-balancing-algorithms", type: "Article", difficulty: "Easy" },
      { title: "LB — Sticky Sessions", url: "https://www.youtube.com/watch?v=tvLDx3Sb1Ms", type: "Video", difficulty: "Medium" },
      // Circuit Breaker
      { title: "Circuit Breaker — Closed / Open / Half-Open States", url: "https://www.youtube.com/watch?v=ADHcBxEXvFA", type: "Video", difficulty: "Medium" },
      { title: "Circuit Breaker — Deep Dive", url: "https://blog.bytebytego.com/p/circuit-breaker-pattern", type: "Article", difficulty: "Medium" },
      // Resilience
      { title: "Fail Fast Principle", url: "https://www.youtube.com/watch?v=IJojE0-18VU", type: "Video", difficulty: "Easy" },
      { title: "Cascading Failure Prevention", url: "https://blog.bytebytego.com/p/how-to-prevent-cascading-failures", type: "Article", difficulty: "Hard" },
      // Leader Election & Consensus
      { title: "Leader Election", url: "https://www.youtube.com/watch?v=rN6ma561tak", type: "Video", difficulty: "Hard" },
      { title: "Quorum Concept", url: "https://blog.bytebytego.com/p/consensus-algorithms-explained", type: "Article", difficulty: "Hard" },
      { title: "Raft Basics — Heartbeats & Majority Consensus", url: "https://www.youtube.com/watch?v=IujMVjKvWP4", type: "Video", difficulty: "Hard" },
      { title: "Raft — Visual Deep Dive", url: "https://thesecretlivesofdata.com/raft/", type: "Article", difficulty: "Hard" },
    ],
  },

  // ════════════════════════════════════════════
  // 5️⃣ ESTIMATION PRACTICE
  // ════════════════════════════════════════════
  {
    name: "Estimation Practice",
    slug: "estimation-practice",
    description: "QPS, Storage, Bandwidth, Traffic Estimation Drills",
    icon: "Calculator",
    order: 5,
    items: [
      { title: "QPS Estimation", url: "https://www.youtube.com/watch?v=FU4WlwfS3G0", type: "Video", difficulty: "Medium" },
      { title: "Storage Estimation", url: "https://blog.bytebytego.com/p/back-of-the-envelope-estimation", type: "Article", difficulty: "Medium" },
      { title: "Bandwidth Estimation", url: "https://www.youtube.com/watch?v=UC5xf8FbdJc", type: "Video", difficulty: "Medium" },
      { title: "Peak vs Average Traffic", url: "https://blog.bytebytego.com/p/back-of-the-envelope-estimation", type: "Article", difficulty: "Easy" },
      { title: "Read/Write Ratio Impact", url: "https://www.youtube.com/watch?v=UC5xf8FbdJc", type: "Video", difficulty: "Medium" },
      { title: "2-Minute Estimation Drill", url: "https://blog.bytebytego.com/p/back-of-the-envelope-estimation", type: "Article", difficulty: "Easy" },
    ],
  },
];

async function main() {
  // Clear existing SD data
  console.log("🗑️  Clearing existing System Design data...");
  await prisma.userSDItem.deleteMany();
  await prisma.sDItem.deleteMany();
  await prisma.sDTopic.deleteMany();

  console.log("📦 Seeding System Design Topics...");

  let totalItems = 0;

  for (const t of topics) {
    const topic = await prisma.sDTopic.create({
      data: {
        name: t.name,
        slug: t.slug,
        description: t.description,
        icon: t.icon,
        order: t.order,
      },
    });

    if (t.items.length > 0) {
      await Promise.all(
        t.items.map((item) =>
          prisma.sDItem.create({
            data: {
              title: item.title,
              url: item.url,
              type: item.type,
              difficulty: item.difficulty,
              topicId: topic.id,
            },
          })
        )
      );
      totalItems += t.items.length;
    }

    console.log(`  ✅ ${t.name} — ${t.items.length} items`);
  }

  console.log(`\n🚀 System Design Seed completed: ${topics.length} topics, ${totalItems} items.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
