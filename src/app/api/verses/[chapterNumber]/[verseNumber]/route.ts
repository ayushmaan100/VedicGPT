import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ chapterNumber: string; verseNumber: string }> }
) {
  try {
    const { chapterNumber: cNumStr, verseNumber: vNumStr } = await params;
    const chapterNumber = parseInt(cNumStr, 10);
    const verseNumber = parseInt(vNumStr, 10);

    if (isNaN(chapterNumber) || isNaN(verseNumber)) {
      return NextResponse.json(
        { error: "Invalid chapter or verse number" },
        { status: 400 }
      );
    }

    // Find the chapter ID first
    const chapter = await prisma.chapter.findFirst({
      where: { chapterNumber },
      select: { id: true },
    });

    if (!chapter) {
      return NextResponse.json(
        { error: "Chapter not found" },
        { status: 404 }
      );
    }

    const verse = await prisma.verse.findUnique({
      where: {
        chapterId_verseNumber: {
          chapterId: chapter.id,
          verseNumber,
        },
      },
      include: {
        translations: true,
        commentaries: true,
      },
    });

    if (!verse) {
      return NextResponse.json(
        { error: "Verse not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(verse);
  } catch (error) {
    console.error(`Error fetching verse:`, error);
    return NextResponse.json(
      { error: "Failed to fetch verse details" },
      { status: 500 }
    );
  }
}
