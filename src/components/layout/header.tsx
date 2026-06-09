import Link from "next/link";
import { Search, BookOpen, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/chapters", label: "Chapters" },
  { href: "/search", label: "Search" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
          id="logo-link"
        >
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 vedic-glow">
            <BookOpen className="size-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-tight tracking-tight vedic-gradient-text">
              VedicGPT
            </span>
            <span className="hidden text-[10px] font-medium uppercase tracking-widest text-muted-foreground sm:block">
              Vedic Knowledge
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex" id="desktop-nav">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <Link href="/search" className="hidden sm:block">
            <Button variant="outline" size="sm" className="gap-2 text-muted-foreground">
              <Search className="size-3.5" />
              <span className="hidden lg:inline">Search scriptures...</span>
              <kbd className="pointer-events-none hidden rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground lg:inline">
                ⌘K
              </kbd>
            </Button>
          </Link>
          <ThemeToggle />
          <MobileNav navLinks={navLinks} />
        </div>
      </div>
    </header>
  );
}
