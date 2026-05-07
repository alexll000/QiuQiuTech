import type { MetadataRoute } from "next";
import { listContents, listRequests, listTopics } from "@/lib/content-service";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [contents, topics, requests] = await Promise.all([
    listContents(),
    listTopics(),
    listRequests(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/contents",
    "/events",
    "/playbooks",
    "/topics",
    "/requests",
    "/submit",
    "/rankings",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : path === "/contents" || path === "/topics" ? 0.9 : 0.7,
  }));

  const contentRoutes: MetadataRoute.Sitemap = contents.map((item) => ({
    url: `${SITE_URL}/contents/${item.slug}`,
    lastModified: item.publishedAt ? new Date(item.publishedAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const topicRoutes: MetadataRoute.Sitemap = topics.map((item) => ({
    url: `${SITE_URL}/topics/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.78,
  }));

  const requestRoutes: MetadataRoute.Sitemap = requests.map((item) => ({
    url: `${SITE_URL}/requests/${item.slug}`,
    lastModified: item.publishedAt ? new Date(item.publishedAt) : new Date(),
    changeFrequency: "daily",
    priority: 0.75,
  }));

  return [...staticRoutes, ...contentRoutes, ...topicRoutes, ...requestRoutes];
}
