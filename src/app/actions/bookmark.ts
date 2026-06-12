"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function toggleBookmark(verseId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be logged in to bookmark verses." };
  }

  const userId = session.user.id;

  try {
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_verseId: {
          userId,
          verseId,
        },
      },
    });

    if (existingBookmark) {
      await prisma.bookmark.delete({
        where: { id: existingBookmark.id },
      });
      revalidatePath(`/verses/[chapterId]/[verseId]`);
      revalidatePath("/bookmarks");
      return { success: true, isBookmarked: false };
    } else {
      await prisma.bookmark.create({
        data: {
          userId,
          verseId,
        },
      });
      revalidatePath(`/verses/[chapterId]/[verseId]`);
      revalidatePath("/bookmarks");
      return { success: true, isBookmarked: true };
    }
  } catch (error) {
    console.error("Failed to toggle bookmark:", error);
    return { error: "Failed to toggle bookmark. Please try again." };
  }
}

export async function checkIsBookmarked(verseId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return false;
  }

  const bookmark = await prisma.bookmark.findUnique({
    where: {
      userId_verseId: {
        userId: session.user.id,
        verseId,
      },
    },
  });

  return !!bookmark;
}
