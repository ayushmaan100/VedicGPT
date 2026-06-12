"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Search, Loader2, BookOpen, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define the shape of our API response
interface SearchResult {
  id: string;
  verseNumber: number;
  chapterId: string;
  slok: string;
  transliteration: string;
  chapter: {
    translation: string;
    chapterNumber: number;
  };
  translations: {
    text: string;
  }[];
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");

  // Handle debouncing to avoid spamming the API
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch results when debounced query changes
  useEffect(() => {
    async function performSearch() {
      if (debouncedQuery.trim().length < 2) {
        setResults([]);
        setHasSearched(false);
        setError("");
        // Remove query from URL if it's too short
        if (searchParams.has("q")) {
          router.replace("/search", { scroll: false });
        }
        return;
      }

      setIsLoading(true);
      setError("");
      setHasSearched(true);

      // Update URL with search param
      router.replace(`?q=${encodeURIComponent(debouncedQuery)}`, { scroll: false });

      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
        if (!res.ok) {
          throw new Error("Failed to fetch results");
        }
        const data = await res.json();
        setResults(data.results || []);
      } catch (err) {
        setError("An error occurred while searching. Please try again.");
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }

    performSearch();
  }, [debouncedQuery, router, searchParams]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-background">
        {/* Search Header */}
        <section className="border-b border-border/40 bg-card/30 vedic-bg-pattern pt-16 pb-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight">Search the Gita</h1>
            <p className="mb-8 text-muted-foreground text-lg">
              Find wisdom by searching for topics like "karma", "duty", "peace", or specific verses.
            </p>

            <div className="relative mx-auto max-w-2xl">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground">
                <Search className="size-5" />
              </div>
              <input
                type="text"
                className="w-full rounded-full border border-primary/20 bg-background py-4 pl-12 pr-4 text-lg text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Search across all verses, translations, and commentaries..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {isLoading && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-primary">
                  <Loader2 className="size-5 animate-spin" />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Search Results */}
        <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          {error && (
            <div className="rounded-lg bg-destructive/10 p-4 text-center text-destructive">
              {error}
            </div>
          )}

          {!isLoading && hasSearched && results.length === 0 && !error && (
            <div className="text-center py-20">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Search className="size-8 opacity-50" />
              </div>
              <h3 className="text-xl font-medium">No results found</h3>
              <p className="mt-2 text-muted-foreground">
                We couldn't find anything matching "{debouncedQuery}". Try different keywords.
              </p>
            </div>
          )}

          <div className="space-y-6">
            {results.map((result) => {
              // Extract chapter number from chapterId string or verse reference.
              // Since we didn't fetch chapterNumber in the API directly from verse, 
              // we can get it because we know the relation, but wait, the API returns the chapter relation.
              // Let's parse it safely.
              return (
                <Link
                  href={`/verses/${result.chapter?.chapterNumber}/${result.verseNumber}`}
                  key={result.id}
                >
                  <div className="group rounded-xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-medium text-primary">
                        <BookOpen className="size-4" />
                        <span>Chapter {result.chapter?.translation}</span>
                      </div>
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                        Verse {result.verseNumber}
                      </span>
                    </div>

                    <div className="mb-4">
                      <p className="sanskrit-text text-lg text-foreground mb-1 line-clamp-1">
                        {result.slok.replace(/\n/g, " ")}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {result.transliteration.replace(/\n/g, " ")}
                      </p>
                    </div>

                    {result.translations && result.translations.length > 0 && (
                      <div className="border-t border-border/40 pt-4 flex gap-3">
                        <Quote className="size-5 shrink-0 text-muted-foreground opacity-50" />
                        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2 italic">
                          "{result.translations[0].text}"
                        </p>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
