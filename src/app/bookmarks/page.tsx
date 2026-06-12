import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, Bookmark, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export const metadata = {
  title: "My Bookmarks | VedicGPT",
  description: "View your saved verses from the Bhagavad Gita.",
};

export default async function BookmarksPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      verse: {
        include: {
          chapter: {
            select: { chapterNumber: true, translation: true },
          },
        },
      },
    },
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight">
                <Bookmark className="size-8 text-primary" />
                My Bookmarks
              </h1>
              <p className="mt-2 text-muted-foreground">
                Your personal collection of spiritual wisdom.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card px-4 py-2 text-sm font-medium">
              <BookOpen className="size-4 text-primary" />
              {bookmarks.length} {bookmarks.length === 1 ? "Verse" : "Verses"} Saved
            </div>
          </div>

          {bookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-card py-20 text-center shadow-sm">
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
                <Bookmark className="size-8 text-primary/60" />
              </div>
              <h2 className="text-xl font-semibold">No bookmarks yet</h2>
              <p className="mt-2 max-w-md text-muted-foreground">
                When you find a verse that speaks to you, click the bookmark icon to save it here for quick reference.
              </p>
              <Link href="/chapters" className="mt-8">
                <Button>
                  Explore Chapters
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {bookmarks.map((bookmark) => (
                <div
                  key={bookmark.id}
                  className="group relative flex flex-col rounded-xl border border-border/50 bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                      <BookOpen className="size-3" />
                      BG {bookmark.verse.chapter.chapterNumber}.{bookmark.verse.verseNumber}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3" />
                      {new Date(bookmark.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex-1">
                    <p className="sanskrit-text mb-4 text-lg leading-loose text-foreground line-clamp-2">
                      {bookmark.verse.slok.replace(/\n/g, " ")}
                    </p>
                    <p className="text-sm italic text-muted-foreground line-clamp-2">
                      {bookmark.verse.transliteration.replace(/\n/g, " ")}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-border/40 pt-4">
                    <Link
                      href={`/verses/${bookmark.verse.chapter.chapterNumber}/${bookmark.verse.verseNumber}`}
                      className="flex items-center text-sm font-medium text-primary transition-colors hover:text-primary/80"
                    >
                      Read full verse
                      <ArrowRight className="ml-1.5 size-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
