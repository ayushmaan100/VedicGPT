import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://vedicgpt.com";

  // Static routes
  const routes = [
    "",
    "/chapters",
    "/search",
    "/about",
    "/login",
    "/register",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Chapters
  const chapters = await prisma.chapter.findMany({
    select: { chapterNumber: true },
  });

  const chapterRoutes = chapters.map((chapter) => ({
    url: `${baseUrl}/chapters/${chapter.chapterNumber}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Verses (limit to first few chapters if too large, but Next.js can handle ~50k urls per sitemap. We have ~700 verses)
  const verses = await prisma.verse.findMany({
    select: {
      chapterId: true,
      verseNumber: true,
      chapter: {
        select: { chapterNumber: true },
      },
    },
  });

  const verseRoutes = verses.map((verse) => ({
    url: `${baseUrl}/verses/${verse.chapter.chapterNumber}/${verse.verseNumber}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...routes, ...chapterRoutes, ...verseRoutes];
}
