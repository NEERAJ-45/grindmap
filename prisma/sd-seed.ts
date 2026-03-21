import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const topics = [
  {
    name: "Databases",
    slug: "databases",
    description: "Relational DBs, Indexing, WAL, ACID, MVCC, Sharding, NoSQL",
    icon: "Database",
    order: 1,
    items: [
      { title: "Relational Databases", checked: true },
      { title: "B+ Tree Indexing - Understand node structure (internal vs leaf nodes)", checked: true },
      { title: "B+ Tree Indexing - Understand branching factor", checked: true },
      { title: "B+ Tree Indexing - Understand disk I/O reduction logic", checked: true },
      { title: "Clustered vs Non-Clustered Index - Storage layout difference", checked: true },
      { title: "Clustered vs Non-Clustered Index - Performance implications", checked: true },
      { title: "Covering Index - Understand index-only scan", checked: true },
      { title: "Covering Index - When it avoids table lookup", checked: true },
      { title: "Query Execution Plan - Read EXPLAIN output", checked: true },
      { title: "Query Execution Plan - Identify full table scan", checked: true },
      { title: "Query Execution Plan - Identify index scan", checked: true },
      { title: "Write-Ahead Logging (WAL) - Understand log-first write principle", checked: true },
      { title: "Write-Ahead Logging (WAL) - Crash recovery flow", checked: true },
      { title: "Checkpointing - Why checkpoints exist", checked: true },
      { title: "Checkpointing - Trade-off between frequency & performance", checked: true },
      { title: "ACID (Implementation Level) - Atomicity via WAL", checked: true },
      { title: "ACID (Implementation Level) - Consistency via constraints", checked: true },
      { title: "ACID (Implementation Level) - Isolation via locking/MVCC", checked: true },
      { title: "ACID (Implementation Level) - Durability via fsync", checked: true },
      { title: "Locking vs MVCC - Read/write blocking behavior", checked: true },
      { title: "Locking vs MVCC - Snapshot visibility", checked: true },
      { title: "Isolation Levels - Dirty Read", checked: true },
      { title: "Isolation Levels - Non-Repeatable Read", checked: true },
      { title: "Isolation Levels - Phantom Read", checked: true },
      { title: "MVCC Mechanics - Version chains", checked: false },
      { title: "MVCC Mechanics - Snapshot creation", checked: false },
      { title: "MVCC Mechanics - Snapshot Isolation", checked: false },
      { title: "MVCC Mechanics - Repeatable Read vs Serializable", checked: false },
      { title: "MVCC Mechanics - Write Skew Problem", checked: false },
      { title: "Replication - Leader-Follower Architecture", checked: false },
      { title: "Replication - Sync vs Async Replication", checked: false },
      { title: "Replication - Replication Lag", checked: false },
      { title: "Replication - Read-After-Write Consistency", checked: false },
      { title: "Replication - Failover Process", checked: false },
      { title: "Scaling Databases - Vertical Scaling", checked: false },
      { title: "Scaling Databases - Horizontal Scaling", checked: false },
      { title: "Scaling Databases - Read Replica Limits", checked: false },
      { title: "Scaling Databases - Write Bottleneck", checked: false },
      { title: "Scaling Databases - Cross-Region Replication Trade-offs", checked: false },
      { title: "Scaling Databases - Strong vs Eventual Consistency", checked: false },
      { title: "Sharding / Partitioning - Range-Based Sharding", checked: false },
      { title: "Sharding / Partitioning - Hash-Based Sharding", checked: false },
      { title: "Sharding / Partitioning - Directory-Based Sharding", checked: false },
      { title: "Sharding / Partitioning - Consistent Hashing", checked: false },
      { title: "Sharding / Partitioning - Rebalancing Strategy", checked: false },
      { title: "Sharding / Partitioning - Hot Partition Issue", checked: false },
      { title: "Sharding / Partitioning - Cross-Shard Joins", checked: false },
      { title: "Sharding / Partitioning - Global Secondary Indexes", checked: false },
      { title: "NoSQL - Key-Value Stores", checked: false },
      { title: "NoSQL - Document Databases", checked: false },
      { title: "NoSQL - Column Stores", checked: false },
      { title: "NoSQL - Graph Databases", checked: false },
      { title: "NoSQL - When to Prefer Each", checked: false },
      { title: "NoSQL - Denormalization Trade-offs", checked: false },
      { title: "NoSQL - Eventual Consistency Behavior", checked: false },
      { title: "NoSQL - Secondary Index Limitations", checked: false },
      { title: "Multi-Leader Conflicts", checked: false },
      { title: "Split Brain", checked: false },
    ],
  },
  {
    name: "Caching",
    slug: "caching",
    description: "Patterns, Eviction, Consistency, Redis",
    icon: "Zap",
    order: 2,
    items: [
      { title: "Core Patterns - Cache-Aside", checked: false },
      { title: "Core Patterns - Write-Through", checked: false },
      { title: "Core Patterns - Write-Back", checked: false },
      { title: "Core Patterns - Write-Around", checked: false },
      { title: "Core Patterns - Cache Warming", checked: false },
      { title: "TTL Strategy Design", checked: false },
      { title: "Eviction Policies - LRU", checked: false },
      { title: "Eviction Policies - LFU", checked: false },
      { title: "Eviction Policies - FIFO", checked: false },
      { title: "Eviction Policies - Random Eviction", checked: false },
      { title: "Eviction Policies - Memory Fragmentation", checked: false },
      { title: "Consistency - Cache Invalidation Strategies", checked: false },
      { title: "Consistency - Double Delete Pattern", checked: false },
      { title: "Consistency - Stale Data Window", checked: false },
      { title: "Consistency - Read-After-Write Inconsistency", checked: false },
      { title: "Failure Scenarios - Cache Stampede", checked: false },
      { title: "Failure Scenarios - Thundering Herd", checked: false },
      { title: "Failure Scenarios - Hot Key Problem", checked: false },
      { title: "Failure Scenarios - Cache Penetration", checked: false },
      { title: "Failure Scenarios - Cold Start Problem", checked: false },
      { title: "Redis Internals - Single-Threaded Event Loop", checked: false },
      { title: "Redis Internals - Why Redis Is Fast", checked: false },
      { title: "Redis Internals - RDB Persistence", checked: false },
      { title: "Redis Internals - AOF Persistence", checked: false },
      { title: "Redis Internals - Replication Model", checked: false },
      { title: "Redis Internals - Sentinel", checked: false },
      { title: "Redis Internals - Cluster Mode", checked: false },
      { title: "Redis Internals - Slot-Based Sharding", checked: false },
    ],
  },
  {
    name: "Async Processing",
    slug: "async-processing",
    description: "Messaging Fundamentals, Kafka, Failure Modes",
    icon: "MessageSquare",
    order: 3,
    items: [
      { title: "Messaging Fundamentals - At-Most-Once", checked: false },
      { title: "Messaging Fundamentals - At-Least-Once", checked: false },
      { title: "Messaging Fundamentals - Exactly-Once (Practical Meaning)", checked: false },
      { title: "Messaging Fundamentals - Idempotency", checked: false },
      { title: "Messaging Fundamentals - Dead Letter Queue", checked: false },
      { title: "Messaging Fundamentals - Retry Strategies", checked: false },
      { title: "Messaging Fundamentals - Backpressure Handling", checked: false },
      { title: "Kafka Internals - Topic Architecture", checked: false },
      { title: "Kafka Internals - Partition Strategy", checked: false },
      { title: "Kafka Internals - Partition Key Selection", checked: false },
      { title: "Kafka Internals - Ordering Guarantees", checked: false },
      { title: "Kafka Internals - Offset Management", checked: false },
      { title: "Kafka Internals - Consumer Groups", checked: false },
      { title: "Kafka Internals - Rebalancing Process", checked: false },
      { title: "Kafka Internals - ISR (In-Sync Replicas)", checked: false },
      { title: "Kafka Internals - Leader Election", checked: false },
      { title: "Kafka Internals - Retention Policies", checked: false },
      { title: "Kafka Internals - Log Compaction", checked: false },
      { title: "Kafka Internals - Pull Model Rationale", checked: false },
      { title: "Failure Modes - Producer Retry Duplication", checked: false },
      { title: "Failure Modes - Consumer Crash Mid-Processing", checked: false },
      { title: "Failure Modes - Broker Failure", checked: false },
      { title: "Failure Modes - Network Partition", checked: false },
      { title: "Failure Modes - Data Loss Scenarios", checked: false },
    ],
  },
  {
    name: "Load Balancing & Resiliency",
    slug: "load-balancing-resiliency",
    description: "Load Balancers, Circuit Breaker, Raft",
    icon: "Network",
    order: 4,
    items: [
      { title: "Load Balancers - L4 vs L7", checked: false },
      { title: "Load Balancers - Round Robin", checked: false },
      { title: "Load Balancers - Least Connections", checked: false },
      { title: "Load Balancers - Consistent Hashing", checked: false },
      { title: "Load Balancers - Health Checks", checked: false },
      { title: "Load Balancers - Sticky Sessions", checked: false },
      { title: "Circuit Breaker - Closed State", checked: false },
      { title: "Circuit Breaker - Open State", checked: false },
      { title: "Circuit Breaker - Half-Open State", checked: false },
      { title: "Fail Fast Principle", checked: false },
      { title: "Cascading Failure Prevention", checked: false },
      { title: "Leader Election", checked: false },
      { title: "Quorum Concept", checked: false },
      { title: "Raft Basics - Heartbeats", checked: false },
      { title: "Raft Basics - Majority Consensus Logic", checked: false },
    ],
  },
  {
    name: "Estimation Practice",
    slug: "estimation-practice",
    description: "QPS, Bandwidth, Storage",
    icon: "Calculator",
    order: 5,
    items: [
      { title: "QPS Estimation", checked: false },
      { title: "Storage Estimation", checked: false },
      { title: "Bandwidth Estimation", checked: false },
      { title: "Peak vs Average Traffic", checked: false },
      { title: "Read/Write Ratio Impact", checked: false },
      { title: "2-Minute Estimation Drill", checked: false },
    ],
  },
];

async function main() {
  const userId = "NEERAJ04";
  console.log("🗑️  Clearing existing System Design data...");
  await prisma.userSDItem.deleteMany();
  await prisma.sDItem.deleteMany();
  await prisma.sDTopic.deleteMany();

  console.log("📦 Seeding System Design Topics from new Notion sync...");

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
      let itemOrder = 0;
      for (const itemData of t.items) {
        const item = await prisma.sDItem.create({
          data: {
            title: itemData.title,
            url: "#", 
            type: "Article", 
            difficulty: "Medium",
            order: itemOrder++,
            topicId: topic.id,
          },
        });

        // Mark as done for NEERAJ04 if checked
        if (itemData.checked) {
          await prisma.userSDItem.create({
            data: {
              userId,
              sdItemId: item.id,
              done: true,
              completedOn: new Date(),
            },
          });
        }
      }
      totalItems += t.items.length;
    }

    console.log(`  ✅ ${t.name} — ${t.items.length} items`);
  }

  console.log(`\n🚀 System Design Seed completed: ${topics.length} topics, ${totalItems} items synced for ${userId}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
