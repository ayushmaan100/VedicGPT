import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: "Search query must be at least 2 characters long" },
        { status: 400 }
      );
    }

    const searchQuery = query.trim();

    // Perform a comprehensive search across Verses, Translations, and Commentaries
    const verses = await prisma.verse.findMany({
      where: {
        OR: [
          // Search in original Sanskrit Shloka
          { slok: { contains: searchQuery, mode: "insensitive" } },
          // Search in Transliteration
          { transliteration: { contains: searchQuery, mode: "insensitive" } },
          // Search in any related translation
          {
            translations: {
              some: {
                text: { contains: searchQuery, mode: "insensitive" },
              },
            },
          },
          // Search in any related commentary
          {
            commentaries: {
              some: {
                text: { contains: searchQuery, mode: "insensitive" },
              },
            },
          },
        ],
      },
      include: {
        chapter: {
          select: {
            chapterNumber: true,
            translation: true,
          },
        },
        translations: {
          where: {
            text: { contains: searchQuery, mode: "insensitive" },
          },
          take: 1, // Just grab the first matching translation to show as a preview
        },
      },
      take: 20, // Limit results to prevent massive payloads
      orderBy: [
        { chapterId: "asc" },
        { verseNumber: "asc" },
      ],
    });

    return NextResponse.json({
      query: searchQuery,
      count: verses.length,
      results: verses,
    });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { error: "An error occurred while searching" },
      { status: 500 }
    );
  }
}
