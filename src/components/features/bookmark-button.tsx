"use client";

import { useState } from "react";
import { Bookmark, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleBookmark } from "@/app/actions/bookmark";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  verseId: string;
  initialBookmarked: boolean;
}

export function BookmarkButton({ verseId, initialBookmarked }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isLoading, setIsLoading] = useState(false);
  const { status } = useSession();
  const router = useRouter();

  async function handleToggle() {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    setIsLoading(true);
    const result = await toggleBookmark(verseId);
    
    if (result.success) {
      setIsBookmarked(result.isBookmarked!);
    }
    
    setIsLoading(false);
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      disabled={isLoading || status === "loading"}
      className={cn(
        "gap-2 transition-all duration-300",
        isBookmarked && "border-primary/50 bg-primary/10 text-primary hover:bg-primary/20"
      )}
    >
      {isLoading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Bookmark className={cn("size-4", isBookmarked && "fill-current")} />
      )}
      <span className="hidden sm:inline">
        {isBookmarked ? "Bookmarked" : "Bookmark"}
      </span>
    </Button>
  );
}
