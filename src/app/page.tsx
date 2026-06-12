import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Search,
  Sparkles,
  Globe,
  Quote,
  ChevronRight,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { prisma } from "@/lib/db";

const features = [
  {
    icon: BookOpen,
    title: "Complete Bhagavad Gita",
    description:
      "All 18 chapters and 700 verses with original Sanskrit, transliteration, and multiple translations.",
  },
  {
    icon: Search,
    title: "Powerful Search",
    description:
      "Search across verses, translations, and commentaries. Find wisdom for any life question.",
  },
  {
    icon: Sparkles,
    title: "Multiple Commentaries",
    description:
      "Read perspectives from Shankaracharya, Ramanuja, Madhva, and Swami Chinmayananda side by side.",
  },
  {
    icon: Globe,
    title: "Sanskrit & Hindi",
    description:
      "Original Devanagari script with transliteration. Supporting both English and Hindi translations.",
  },
];

const stats = [
  { value: "18", label: "Chapters" },
  { value: "700", label: "Verses" },
  { value: "4,900+", label: "Translations" },
  { value: "11,000+", label: "Commentaries" },
];

/**
 * Get a deterministic "Verse of the Day" based on the current date.
 * Uses a simple hash of the date string to pick a verse index.
 */
async function getVerseOfTheDay() {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const verseCount = await prisma.verse.count();
  const index = Math.abs(hash) % verseCount;

  const verse = await prisma.verse.findFirst({
    skip: index,
    take: 1,
    include: {
      chapter: { select: { chapterNumber: true, translation: true } },
      translations: {
        where: { language: "en" },
        take: 1,
      },
    },
  });
  return verse;
}

async function getFeaturedChapters() {
  return prisma.chapter.findMany({
    orderBy: { chapterNumber: "asc" },
    take: 6,
    select: {
      id: true,
      chapterNumber: true,
      name: true,
      translation: true,
      meaningEn: true,
      versesCount: true,
    },
  });
}

export default async function HomePage() {
  const [verseOfTheDay, featuredChapters] = await Promise.all([
    getVerseOfTheDay(),
    getFeaturedChapters(),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden vedic-bg-pattern">
          {/* Decorative Background Elements */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-40 -top-40 size-80 rounded-full bg-vedic-gold/5 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 size-60 rounded-full bg-vedic-saffron/5 blur-3xl" />
            <div className="absolute left-1/2 top-1/3 size-96 -translate-x-1/2 rounded-full bg-vedic-amber/3 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
            <div className="mx-auto max-w-3xl text-center">
              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                <Sparkles className="size-3.5" />
                <span>Open Source Vedic Knowledge Platform</span>
              </div>

              {/* Headline */}
              <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Explore the{" "}
                <span className="vedic-gradient-text">Bhagavad Gita</span>
                <br />
                with Clarity & Depth
              </h1>

              {/* Sanskrit Quote */}
              <div className="mb-6">
                <p className="sanskrit-text text-center opacity-80">
                  कर्मण्येवाधिकारस्ते मा फलेषु कदाचन
                </p>
                <p className="mt-1 text-sm italic text-muted-foreground">
                  &quot;You have a right to perform your prescribed duties, but
                  you are not entitled to the fruits of your actions.&quot;
                  <span className="ml-1 text-primary">— BG 2.47</span>
                </p>
              </div>

              {/* Description */}
              <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Search 700 verses of the Bhagavad Gita with original Sanskrit,
                word-by-word meanings, multiple translations, and commentaries
                from the greatest philosophers of India.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/chapters"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "gap-2 px-6"
                  )}
                  id="cta-explore"
                >
                  <BookOpen className="size-4" />
                  Explore All Chapters
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/search"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "gap-2 px-6"
                  )}
                  id="cta-search"
                >
                  <Search className="size-4" />
                  Search Verses
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y border-border/40 bg-card/50">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold vedic-gradient-text sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Verse of the Day */}
        {verseOfTheDay && (
          <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">
                <span className="vedic-gradient-text">Verse of the Day</span>
              </h2>
              <p className="text-sm text-muted-foreground">
                A daily dose of timeless wisdom from the Gita
              </p>
            </div>

            <Link
              href={`/verses/${verseOfTheDay.chapter.chapterNumber}/${verseOfTheDay.verseNumber}`}
            >
              <div className="group relative mx-auto max-w-3xl overflow-hidden rounded-2xl border border-primary/20 bg-card p-8 transition-all duration-500 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 sm:p-10">
                {/* Decorative corner glow */}
                <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-vedic-gold/5 blur-2xl transition-all duration-500 group-hover:bg-vedic-gold/10" />
                <div className="pointer-events-none absolute -bottom-8 -left-8 size-32 rounded-full bg-vedic-saffron/5 blur-2xl transition-all duration-500 group-hover:bg-vedic-saffron/10" />

                <div className="relative z-10">
                  {/* Verse reference badge */}
                  <div className="mb-6 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                      <BookOpen className="size-3" />
                      BG {verseOfTheDay.chapter.chapterNumber}.
                      {verseOfTheDay.verseNumber}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {verseOfTheDay.chapter.translation}
                    </span>
                  </div>

                  {/* Sanskrit text */}
                  <p className="sanskrit-text mb-6 text-center text-xl leading-[2.2] sm:text-2xl">
                    {verseOfTheDay.slok
                      .split("\n")
                      .filter((l) => l.trim())
                      .slice(0, 4)
                      .join(" ")}
                  </p>

                  {/* Translation */}
                  {verseOfTheDay.translations[0] && (
                    <div className="flex gap-3 border-t border-border/40 pt-6">
                      <Quote className="mt-1 size-5 shrink-0 text-primary/50" />
                      <p className="text-base italic leading-relaxed text-muted-foreground">
                        &quot;{verseOfTheDay.translations[0].text}&quot;
                      </p>
                    </div>
                  )}

                  <div className="mt-6 flex items-center justify-end text-sm font-medium text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Read full verse with commentaries
                    <ChevronRight className="ml-1 size-4" />
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Featured Chapters Grid */}
        <section className="border-t border-border/40 bg-card/30">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <h2 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">
                  Begin Your <span className="vedic-gradient-text">Journey</span>
                </h2>
                <p className="text-muted-foreground">
                  Explore the chapters of the Bhagavad Gita
                </p>
              </div>
              <Link
                href="/chapters"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "hidden gap-1 sm:inline-flex"
                )}
              >
                View all 18
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredChapters.map((chapter) => (
                <Link
                  href={`/chapters/${chapter.chapterNumber}`}
                  key={chapter.id}
                >
                  <div className="group relative flex h-full items-center gap-4 overflow-hidden rounded-xl border border-border/50 bg-card p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5">
                    {/* Chapter number */}
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-xl font-bold text-primary transition-all duration-300 group-hover:bg-primary/15 group-hover:scale-105">
                      {chapter.chapterNumber}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">
                        {chapter.translation}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {chapter.name}{" "}
                        <span className="text-xs">
                          · {chapter.versesCount} verses
                        </span>
                      </p>
                    </div>

                    <ChevronRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5" />
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile "View all" */}
            <div className="mt-8 text-center sm:hidden">
              <Link
                href="/chapters"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "gap-1"
                )}
              >
                View all 18 chapters
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold tracking-tight">
              Why <span className="vedic-gradient-text">VedicGPT</span>?
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              Unlike other Gita apps, we prioritize authenticity, citations, and
              multiple philosophical perspectives.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-border/40 bg-card/50 p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/15">
                  <feature.icon className="size-5 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="border-t border-border/40 vedic-bg-pattern">
          <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              Begin Your Journey
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
              Dive into the timeless wisdom of the Bhagavad Gita. Start reading
              from Chapter 1, or search for guidance on any topic.
            </p>
            <Link
              href="/chapters"
              className={cn(
                buttonVariants({ size: "lg" }),
                "gap-2 px-8"
              )}
              id="cta-bottom"
            >
              Start Reading
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
