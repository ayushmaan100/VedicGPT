import Link from "next/link";
import { prisma } from "@/lib/db";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BookOpen } from "lucide-react";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Chapters | VedicGPT",
  description: "Explore all 18 chapters of the Bhagavad Gita. Find summaries, verse counts, and deep philosophical insights for each chapter.",
  openGraph: {
    title: "All 18 Chapters of the Bhagavad Gita | VedicGPT",
    description: "Explore all 18 chapters of the Bhagavad Gita. Find summaries, verse counts, and deep philosophical insights.",
    url: "https://vedicgpt.com/chapters",
    siteName: "VedicGPT",
    type: "website",
  },
};

export default async function ChaptersPage() {
  // Fetch chapters directly from the database (Server Component)
  const chapters = await prisma.chapter.findMany({
    orderBy: { chapterNumber: "asc" },
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": chapters.map((chapter, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://vedicgpt.com/chapters/${chapter.chapterNumber}`,
      "name": `Chapter ${chapter.chapterNumber}: ${chapter.translation}`,
      "description": chapter.summaryEn
    }))
  };

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="border-b border-border/40 bg-card/30 vedic-bg-pattern">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
                The 18 Chapters
              </h1>
              <p className="text-lg text-muted-foreground">
                The Bhagavad Gita is organized into 18 chapters, each offering
                unique philosophical insights and pathways to spiritual realization.
              </p>
            </div>
          </div>
        </section>

        {/* Chapters Grid */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {chapters.map((chapter) => (
              <Link href={`/chapters/${chapter.chapterNumber}`} key={chapter.id}>
                <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5">
                  {/* Decorative number background */}
                  <div className="pointer-events-none absolute -right-4 -top-6 text-[8rem] font-black leading-none text-muted/10 transition-all duration-300 group-hover:text-primary/5 group-hover:scale-110">
                    {chapter.chapterNumber}
                  </div>

                  <div className="relative z-10 flex flex-1 flex-col">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <span className="font-bold">{chapter.chapterNumber}</span>
                      </div>
                      <div>
                        <h2 className="font-bold leading-tight text-foreground">
                          {chapter.translation}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {chapter.name}
                        </p>
                      </div>
                    </div>

                    <p className="mb-6 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {chapter.summaryEn ||
                        "No summary available for this chapter."}
                    </p>

                    <div className="mt-auto flex items-center justify-between border-t border-border/40 pt-4 text-sm font-medium text-primary">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="size-4" />
                        {chapter.versesCount} Verses
                      </span>
                      <span className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        Read Chapter →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
