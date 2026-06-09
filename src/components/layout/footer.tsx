import Link from "next/link";
import { BookOpen, ExternalLink, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/40 bg-background/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="size-4 text-primary" />
              </div>
              <span className="text-lg font-bold vedic-gradient-text">
                VedicGPT
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Helping humanity access thousands of years of Vedic wisdom
              accurately and transparently.
            </p>
          </div>

          {/* Scriptures */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Scriptures
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/chapters"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Bhagavad Gita
                </Link>
              </li>
              <li>
                <span className="text-sm text-muted-foreground/50">
                  Upanishads (Coming Soon)
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground/50">
                  Yoga Sutras (Coming Soon)
                </span>
              </li>
            </ul>
          </div>

          {/* Explore */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Explore
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/search"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Search Verses
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  About VedicGPT
                </Link>
              </li>
            </ul>
          </div>

          {/* Project */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Project
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <ExternalLink className="size-3.5" />
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="vedic-divider mt-8" />
        <div className="mt-6 flex flex-col items-center justify-between gap-2 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} VedicGPT. Open source project.
          </p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            Made with <Heart className="size-3 text-vedic-saffron" /> for seekers
            of truth
          </p>
        </div>
      </div>
    </footer>
  );
}
