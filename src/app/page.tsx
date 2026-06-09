import Link from "next/link";
import { ArrowRight, BookOpen, Search, Sparkles, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

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
      "Read perspectives from Shankaracharya, Ramanuja, Madhva, and Prabhupada side by side.",
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
  { value: "4+", label: "Commentaries" },
  { value: "5000+", label: "Years of Wisdom" },
];

export default function HomePage() {
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
                <Link href="/chapters">
                  <Button size="lg" className="gap-2 px-6" id="cta-explore">
                    <BookOpen className="size-4" />
                    Explore Chapters
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
                <Link href="/search">
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 px-6"
                    id="cta-search"
                  >
                    <Search className="size-4" />
                    Search Verses
                  </Button>
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

        {/* CTA Section */}
        <section className="border-t border-border/40 vedic-bg-pattern">
          <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              Begin Your Journey
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
              Dive into the timeless wisdom of the Bhagavad Gita. Start reading
              from Chapter 1, or search for guidance on any topic.
            </p>
            <Link href="/chapters">
              <Button size="lg" className="gap-2 px-8" id="cta-bottom">
                Start Reading
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
