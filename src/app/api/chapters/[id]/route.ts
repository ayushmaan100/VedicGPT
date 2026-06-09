import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const chapterNumber = parseInt(id, 10);

    if (isNaN(chapterNumber)) {
      return NextResponse.json(
        { error: "Invalid chapter number" },
        { status: 400 }
      );
    }

    const chapter = await prisma.chapter.findFirst({
      where: { chapterNumber },
      include: {
        verses: {
          orderBy: { verseNumber: "asc" },
          select: {
            id: true,
            verseNumber: true,
            verseId: true,
            slok: true,
            transliteration: true,
          },
        },
      },
    });

    if (!chapter) {
      return NextResponse.json(
        { error: "Chapter not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.error(`Error fetching chapter:`, error);
    return NextResponse.json(
      { error: "Failed to fetch chapter details" },
      { status: 500 }
    );
  }
}
