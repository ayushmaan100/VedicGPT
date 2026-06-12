"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, BookOpen } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";
import { UserMenu } from "@/components/auth/user-menu";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/chapters", label: "Chapters" },
  { href: "/search", label: "Search" },
  { href: "/about", label: "About" },
];

export function Header() {
  const pathname = usePathname();

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
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute inset-x-1 -bottom-[calc(0.5rem+1px)] h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <Link
            href="/search"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "hidden gap-2 text-muted-foreground sm:inline-flex"
            )}
          >
            <Search className="size-3.5" />
            <span className="hidden lg:inline">Search scriptures...</span>
            <kbd className="pointer-events-none hidden rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground lg:inline">
              ⌘K
            </kbd>
          </Link>
          <ThemeToggle />
          <UserMenu />
          <MobileNav navLinks={navLinks} />
        </div>
      </div>
    </header>
  );
}
