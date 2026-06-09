import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const chapters = await prisma.chapter.findMany({
      orderBy: { chapterNumber: "asc" },
      select: {
        id: true,
        chapterNumber: true,
        name: true,
        translation: true,
        transliteration: true,
        meaningEn: true,
        meaningHi: true,
        summaryEn: true,
        summaryHi: true,
        versesCount: true,
      },
    });

    return NextResponse.json(chapters);
  } catch (error) {
    console.error("Error fetching chapters:", error);
    return NextResponse.json(
      { error: "Failed to fetch chapters" },
      { status: 500 }
    );
  }
}
