const cache = new Map<string, { difficulty: string; timestamp: number }>();
const TTL = 60 * 60 * 1000; // 1 hour

export async function fetchDifficulty(
  slug: string
): Promise<string> {
  const cached = cache.get(slug);
  if (cached && Date.now() - cached.timestamp < TTL) {
    return cached.difficulty;
  }

  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `query getQuestionDetail($titleSlug: String!) {
          question(titleSlug: $titleSlug) {
            difficulty
          }
        }`,
        variables: { titleSlug: slug },
      }),
    });

    const json = await response.json();
    const difficulty = json?.data?.question?.difficulty ?? "Unknown";

    cache.set(slug, { difficulty, timestamp: Date.now() });
    return difficulty;
  } catch {
    return "Unknown";
  }
}
