export interface ParsedProblem {
  srNo: number;
  title: string;
  url: string;
  slug: string;
}

export function parsePaste(text: string): ParsedProblem[] {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const results: ParsedProblem[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Try to extract URL
    const urlMatch = line.match(
      /https?:\/\/leetcode\.com\/problems\/([a-z0-9-]+)\/?/
    );

    if (!urlMatch) continue;

    const url = urlMatch[0].replace(/\/$/, "");
    const slug = urlMatch[1];

    // Try to extract title from before the URL
    let title = "";
    const beforeUrl = line.substring(0, line.indexOf(urlMatch[0])).trim();

    if (beforeUrl) {
      // Remove leading number, dot, dash patterns like "1." or "1 -" or "1)"
      title = beforeUrl
        .replace(/^\d+[\.\)\-\s]+/, "")
        .replace(/[\s\-—–]+$/, "")
        .trim();
    }

    if (!title) {
      // Generate title from slug
      title = slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    }

    results.push({
      srNo: results.length + 1,
      title,
      url,
      slug,
    });
  }

  return results;
}
