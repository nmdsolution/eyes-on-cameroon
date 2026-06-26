export interface DevToArticle {
  id: string;
  title: string;
  excerpt: string;
  published_at: string;
  slug: string;
  cover_url?: string;
  external_url: string;
  source: "devto";
  author?: string;
}

const DEVTO_USERNAME = process.env.DEVTO_USERNAME ?? "eyesoncameroon";
const DEVTO_TAGS = (process.env.DEVTO_TAGS ?? "cameroon,africa,culture").split(",").map((t) => t.trim());
const DEVTO_BASE = "https://dev.to/api";

function mapArticle(a: {
  id: number;
  title: string;
  description: string;
  published_at: string;
  slug: string;
  cover_image?: string;
  url: string;
  user?: { name?: string; username?: string };
}): DevToArticle {
  return {
    id: String(a.id),
    title: a.title ?? "",
    excerpt: a.description ?? "",
    published_at: a.published_at?.split("T")[0] ?? "",
    slug: a.slug ?? String(a.id),
    cover_url: a.cover_image ?? undefined,
    external_url: a.url,
    source: "devto" as const,
    author: a.user?.name ?? a.user?.username,
  };
}

async function fetchByUsername(username: string, perPage = 9): Promise<DevToArticle[]> {
  const res = await fetch(
    `${DEVTO_BASE}/articles?username=${username}&per_page=${perPage}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data.map(mapArticle) : [];
}

async function fetchByTag(tag: string, perPage = 6): Promise<DevToArticle[]> {
  const res = await fetch(
    `${DEVTO_BASE}/articles?tag=${encodeURIComponent(tag)}&per_page=${perPage}&state=fresh`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data.map(mapArticle) : [];
}

export async function fetchDevToArticles(maxTotal = 12): Promise<DevToArticle[]> {
  const [accountArticles, ...tagResults] = await Promise.allSettled([
    fetchByUsername(DEVTO_USERNAME, maxTotal),
    ...DEVTO_TAGS.map((tag) => fetchByTag(tag, 6)),
  ]);

  const seen = new Set<string>();
  const merged: DevToArticle[] = [];

  const addAll = (articles: DevToArticle[]) => {
    for (const a of articles) {
      if (!seen.has(a.id)) {
        seen.add(a.id);
        merged.push(a);
      }
    }
  };

  if (accountArticles.status === "fulfilled") addAll(accountArticles.value);
  for (const result of tagResults) {
    if (result.status === "fulfilled") addAll(result.value);
  }

  merged.sort((a, b) => (a.published_at < b.published_at ? 1 : -1));

  return merged.slice(0, maxTotal);
}
