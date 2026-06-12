"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { LogOut, User, Bookmark } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { logout } from "@/app/actions/auth";

export function UserMenu() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (status === "loading") {
    return (
      <div className="size-8 animate-pulse rounded-full bg-muted" />
    );
  }

  if (!session?.user) {
    return (
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: "default", size: "sm" }),
          "gap-1.5"
        )}
      >
        <User className="size-3.5" />
        Sign In
      </Link>
    );
  }

  const initials = session.user.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex size-8 items-center justify-center overflow-hidden rounded-full border border-border/50 bg-primary/10 text-sm font-semibold text-primary transition-all hover:ring-2 hover:ring-primary/20"
        aria-label="User menu"
      >
        {session.user.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || "User"}
            className="size-full object-cover"
          />
        ) : (
          initials
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-10 z-50 w-56 overflow-hidden rounded-xl border border-border/50 bg-card shadow-xl">
          {/* User info */}
          <div className="border-b border-border/40 px-4 py-3">
            <p className="text-sm font-medium text-foreground truncate">
              {session.user.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {session.user.email}
            </p>
          </div>

          {/* Menu items */}
          <div className="p-1">
            <Link
              href="/bookmarks"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
            >
              <Bookmark className="size-4 text-muted-foreground" />
              My Bookmarks
            </Link>
          </div>

          {/* Sign out */}
          <div className="border-t border-border/40 p-1">
            <form action={logout}>
              <button
                type="submit"
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
              >
                <LogOut className="size-4" />
                Sign Out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
