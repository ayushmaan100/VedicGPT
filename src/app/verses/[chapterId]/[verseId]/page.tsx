import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ArrowLeft, ArrowRight, BookOpen, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ chapterId: string; verseId: string }>;
}) {
  const { chapterId, verseId } = await params;
  return {
    title: `Bhagavad Gita ${chapterId}.${verseId} | VedicGPT`,
    description: `Read Verse ${chapterId}.${verseId} of the Bhagavad Gita with original Sanskrit, translation, and philosophical commentaries.`,
  };
}

export default async function VersePage({
  params,
}: {
  params: Promise<{ chapterId: string; verseId: string }>;
}) {
  const { chapterId: cIdStr, verseId: vIdStr } = await params;
  const chapterNumber = parseInt(cIdStr, 10);
  const verseNumber = parseInt(vIdStr, 10);

  if (isNaN(chapterNumber) || isNaN(verseNumber)) {
    notFound();
  }

  const chapter = await prisma.chapter.findFirst({
    where: { chapterNumber },
    select: { id: true, translation: true, versesCount: true },
  });

  if (!chapter) notFound();

  const verse = await prisma.verse.findUnique({
    where: {
      chapterId_verseNumber: {
        chapterId: chapter.id,
        verseNumber,
      },
    },
    include: {
      translations: { orderBy: { authorKey: "asc" } },
      commentaries: { orderBy: { authorKey: "asc" } },
    },
  });

  if (!verse) notFound();

  // Navigation logic
  const hasNext = verseNumber < chapter.versesCount;
  const hasPrev = verseNumber > 1;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-background">
        {/* Navigation Bar */}
        <div className="border-b border-border/40 bg-card/30">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <Link href={`/chapters/${chapterNumber}`}>
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                <BookOpen className="size-4" />
                <span className="hidden sm:inline">Chapter {chapterNumber}: {chapter.translation}</span>
                <span className="sm:hidden">Ch {chapterNumber}</span>
              </Button>
            </Link>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" asChild disabled={!hasPrev}>
                <Link href={hasPrev ? `/verses/${chapterNumber}/${verseNumber - 1}` : "#"} className={!hasPrev ? "pointer-events-none opacity-50" : ""}>
                  <ArrowLeft className="size-4" />
                  <span className="sr-only">Previous Verse</span>
                </Link>
              </Button>
              <div className="flex w-24 items-center justify-center font-medium">
                BG {chapterNumber}.{verseNumber}
              </div>
              <Button variant="outline" size="icon" asChild disabled={!hasNext}>
                <Link href={hasNext ? `/verses/${chapterNumber}/${verseNumber + 1}` : "#"} className={!hasNext ? "pointer-events-none opacity-50" : ""}>
                  <ArrowRight className="size-4" />
                  <span className="sr-only">Next Verse</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Verse Content */}
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          
          {/* Shloka Display */}
          <div className="mb-16 text-center">
            <h1 className="sanskrit-text mx-auto max-w-2xl text-2xl font-medium leading-loose text-foreground sm:text-3xl sm:leading-loose">
              {verse.slok.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </h1>
            
            <div className="mx-auto mt-8 max-w-2xl border-t border-border/40 pt-8">
              <p className="text-lg italic leading-relaxed text-muted-foreground">
                {verse.transliteration.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
            </div>
          </div>

          {/* English Translations */}
          <div className="mb-12">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
              <Quote className="size-5 text-primary" />
              English Translations
            </h2>
            <div className="space-y-4">
              {verse.translations
                .filter((t) => t.language === "en")
                .map((translation) => (
                  <div key={translation.id} className="rounded-xl border border-border/50 bg-card p-5">
                    <p className="mb-3 text-lg leading-relaxed text-foreground/90">
                      &quot;{translation.text}&quot;
                    </p>
                    <p className="text-sm font-medium text-primary">— {translation.authorName}</p>
                  </div>
                ))}
            </div>
          </div>

          {/* Hindi Translations */}
          {verse.translations.some((t) => t.language === "hi") && (
            <div className="mb-16">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
                <Quote className="size-5 text-primary" />
                Hindi Translations (हिंदी अनुवाद)
              </h2>
              <div className="space-y-4">
                {verse.translations
                  .filter((t) => t.language === "hi")
                  .map((translation) => (
                    <div key={translation.id} className="rounded-xl border border-border/50 bg-card p-5">
                      <p className="mb-3 text-lg leading-relaxed text-foreground/90">
                        &quot;{translation.text}&quot;
                      </p>
                      <p className="text-sm font-medium text-primary">— {translation.authorName}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Commentaries Section */}
          <div>
            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
              <BookOpen className="size-5 text-primary" />
              Philosophical Commentaries
            </h2>
            <div className="space-y-6">
              {verse.commentaries
                .filter((c) => c.language === "en")
                .map((commentary) => (
                  <div key={commentary.id} className="rounded-xl border border-border/50 bg-card/50 p-6">
                    <div className="mb-4 flex items-center justify-between border-b border-border/40 pb-4">
                      <h3 className="font-semibold text-foreground">{commentary.authorName}</h3>
                      {commentary.school && (
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                          {commentary.school}
                        </span>
                      )}
                    </div>
                    <div className="prose prose-sm max-w-none text-muted-foreground sm:prose-base dark:prose-invert">
                      {commentary.text.split('\n').map((paragraph, i) => (
                        <p key={i} className="mb-4 last:mb-0">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
