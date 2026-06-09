import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const chapterNumber = parseInt(id, 10);
  
  if (isNaN(chapterNumber)) return { title: "Chapter Not Found" };

  const chapter = await prisma.chapter.findFirst({
    where: { chapterNumber },
    select: { translation: true, name: true },
  });

  if (!chapter) return { title: "Chapter Not Found" };

  return {
    title: `Chapter ${chapterNumber}: ${chapter.translation} | VedicGPT`,
    description: `Read Chapter ${chapterNumber} (${chapter.name}) of the Bhagavad Gita with all verses and commentaries.`,
  };
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const chapterNumber = parseInt(id, 10);

  if (isNaN(chapterNumber)) {
    notFound();
  }

  const chapter = await prisma.chapter.findFirst({
    where: { chapterNumber },
    include: {
      verses: {
        orderBy: { verseNumber: "asc" },
      },
    },
  });

  if (!chapter) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Chapter Header */}
        <section className="relative border-b border-border/40 bg-card/30 vedic-bg-pattern">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <Link href="/chapters" className="mb-8 inline-block">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="size-4" />
                Back to All Chapters
              </Button>
            </Link>

            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                Chapter {chapter.chapterNumber}
              </div>
              <h1 className="mb-2 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                {chapter.translation}
              </h1>
              <h2 className="mb-6 text-2xl font-medium text-muted-foreground sanskrit-text">
                {chapter.name}
              </h2>

              <p className="mx-auto mb-8 text-lg leading-relaxed text-foreground/80">
                {chapter.summaryEn}
              </p>

              <div className="flex justify-center gap-6 border-t border-border/50 pt-8 text-sm text-muted-foreground">
                <div className="flex flex-col items-center">
                  <span className="font-medium text-foreground">{chapter.versesCount}</span>
                  <span>Verses</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Verses List */}
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {chapter.verses.map((verse) => (
              <Link href={`/verses/${chapter.chapterNumber}/${verse.verseNumber}`} key={verse.id}>
                <div className="group flex flex-col gap-4 rounded-xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 sm:flex-row sm:items-center sm:gap-6">
                  {/* Verse Number Badge */}
                  <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/5 text-primary transition-colors group-hover:bg-primary/10">
                    <span className="text-xs font-medium uppercase tracking-wider opacity-70">Verse</span>
                    <span className="text-xl font-bold">{verse.verseNumber}</span>
                  </div>

                  {/* Verse Preview */}
                  <div className="flex-1 space-y-2">
                    <p className="sanskrit-text line-clamp-2 text-lg text-foreground">
                      {verse.slok.split("\n").join(" ")}
                    </p>
                    <p className="line-clamp-1 text-sm text-muted-foreground">
                      {verse.transliteration.split("\n").join(" ")}
                    </p>
                  </div>

                  {/* Action Icon */}
                  <div className="shrink-0 text-muted-foreground transition-colors group-hover:text-primary">
                    <BookOpen className="size-5" />
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
