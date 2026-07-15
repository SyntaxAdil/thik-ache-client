import { MetadataRoute } from "next";

const BASE_URL = "https://thikache.vercel.app";

interface HelpRequestSummary {
  _id: string;
  updatedAt: string;
}

async function getAllRequestIds(): Promise<HelpRequestSummary[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/requests?limit=1000&fields=_id,updatedAt`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) return [];

    const data = await res.json();
    return data?.requests ?? data?.data ?? [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/explore`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/community`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/trust`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/register`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const requests = await getAllRequestIds();

  const requestRoutes: MetadataRoute.Sitemap = requests.map((req) => ({
    url: `${BASE_URL}/explore/${req._id}`,
    lastModified: new Date(req.updatedAt),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...requestRoutes];
}