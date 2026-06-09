import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

// ============================================================
// Bhagavad Gita Data Seeder
// Fetches data from the vedicscriptures API and populates the database
// ============================================================

const API_BASE = "https://vedicscriptures.github.io";

// Author metadata mapping
const AUTHOR_META: Record<
  string,
  { name: string; school?: string; hasEn?: boolean; hasHi?: boolean; hasSanskrit?: boolean }
> = {
  siva: { name: "Swami Sivananda", hasEn: true },
  purohit: { name: "Shri Purohit Swami", hasEn: true },
  chinmay: { name: "Swami Chinmayananda", hasHi: true },
  san: { name: "Dr. S. Sankaranarayan", hasEn: true },
  adi: { name: "Swami Adidevananda", hasEn: true },
  gambir: { name: "Swami Gambirananda", hasEn: true },
  madhav: { name: "Sri Madhavacharya", school: "Dvaita", hasSanskrit: true },
  anand: { name: "Sri Anandgiri", school: "Advaita", hasSanskrit: true },
  rams: { name: "Swami Ramsukhdas", hasHi: true },
  raman: { name: "Sri Ramanuja", school: "Vishishtadvaita", hasSanskrit: true },
  abhinav: { name: "Sri Abhinavgupta", hasSanskrit: true },
  sankar: { name: "Sri Shankaracharya", school: "Advaita", hasSanskrit: true },
  jaya: { name: "Sri Jayatritha", school: "Dvaita", hasSanskrit: true },
  vallabh: { name: "Sri Vallabhacharya", hasSanskrit: true },
  ms: { name: "Sri Madhusudan Saraswati", hasSanskrit: true },
  spiegel: { name: "Dr. S. Spiegel", hasEn: true },
  tej: { name: "Swami Tejomayananda", hasHi: true },
  prabhu: { name: "A.C. Bhaktivedanta Swami Prabhupada", hasEn: true, hasHi: true },
  neel: { name: "Sri Neelkanth", hasSanskrit: true },
  dhan: { name: "Sri Dhanpati", hasSanskrit: true },
};

interface ChapterData {
  chapter_number: number;
  verses_count: number;
  name: string;
  translation: string;
  transliteration: string;
  meaning: { en: string; hi: string };
  summary: { en: string; hi: string };
}

interface VerseData {
  _id: string;
  chapter: number;
  verse: number;
  slok: string;
  transliteration: string;
  [key: string]: unknown;
}

async function fetchJSON<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

async function seed() {
  console.log("🕉  VedicGPT Data Seeder");
  console.log("========================\n");

  // ---- Step 1: Create Scripture ----
  console.log("📜 Creating Bhagavad Gita scripture entry...");
  const scripture = await prisma.scripture.upsert({
    where: { slug: "bhagavad-gita" },
    update: {},
    create: {
      name: "Bhagavad Gita",
      nameHi: "भगवद्गीता",
      slug: "bhagavad-gita",
      description:
        "The Bhagavad Gita is a 700-verse Hindu scripture that is part of the Indian epic Mahabharata. It is a dialogue between Prince Arjuna and Lord Krishna, who serves as his charioteer.",
      descriptionHi:
        "भगवद्गीता एक 700 श्लोकों वाला हिंदू धर्मग्रंथ है जो भारतीय महाकाव्य महाभारत का हिस्सा है। यह राजकुमार अर्जुन और भगवान कृष्ण के बीच का संवाद है, जो उनके सारथी के रूप में कार्य करते हैं।",
      totalChapters: 18,
      totalVerses: 700,
    },
  });
  console.log(`   ✅ Scripture: ${scripture.name} (${scripture.id})\n`);

  // ---- Step 2: Fetch and create chapters ----
  console.log("📖 Fetching chapters from API...");
  const chaptersData = await fetchJSON<ChapterData[]>(`${API_BASE}/chapters`);
  console.log(`   Found ${chaptersData.length} chapters.\n`);

  for (const chData of chaptersData) {
    console.log(`   📕 Chapter ${chData.chapter_number}: ${chData.translation}`);

    const chapter = await prisma.chapter.upsert({
      where: {
        scriptureId_chapterNumber: {
          scriptureId: scripture.id,
          chapterNumber: chData.chapter_number,
        },
      },
      update: {
        name: chData.name,
        translation: chData.translation,
        transliteration: chData.transliteration,
        meaningEn: chData.meaning.en,
        meaningHi: chData.meaning.hi,
        summaryEn: chData.summary.en,
        summaryHi: chData.summary.hi,
        versesCount: chData.verses_count,
      },
      create: {
        chapterNumber: chData.chapter_number,
        name: chData.name,
        translation: chData.translation,
        transliteration: chData.transliteration,
        meaningEn: chData.meaning.en,
        meaningHi: chData.meaning.hi,
        summaryEn: chData.summary.en,
        summaryHi: chData.summary.hi,
        versesCount: chData.verses_count,
        scriptureId: scripture.id,
      },
    });

    // ---- Step 3: Fetch verses for this chapter ----
    console.log(`      Fetching ${chData.verses_count} verses...`);
    let versesSeeded = 0;
    let translationsSeeded = 0;
    let commentariesSeeded = 0;

    for (let v = 1; v <= chData.verses_count; v++) {
      try {
        const verseData = await fetchJSON<VerseData>(
          `${API_BASE}/slok/${chData.chapter_number}/${v}`
        );

        const verse = await prisma.verse.upsert({
          where: { verseId: verseData._id },
          update: {
            slok: verseData.slok,
            transliteration: verseData.transliteration,
          },
          create: {
            verseNumber: verseData.verse,
            verseId: verseData._id,
            slok: verseData.slok,
            transliteration: verseData.transliteration,
            chapterId: chapter.id,
          },
        });
        versesSeeded++;

        // ---- Step 4: Extract translations and commentaries ----
        for (const [key, meta] of Object.entries(AUTHOR_META)) {
          const authorData = verseData[key] as
            | Record<string, string>
            | undefined;
          if (!authorData) continue;

          // English translation (et)
          if (authorData.et && meta.hasEn) {
            await prisma.translation.upsert({
              where: {
                verseId_authorKey_language: {
                  verseId: verse.id,
                  authorKey: key,
                  language: "en",
                },
              },
              update: { text: authorData.et },
              create: {
                language: "en",
                text: authorData.et,
                authorName: meta.name,
                authorKey: key,
                verseId: verse.id,
              },
            });
            translationsSeeded++;
          }

          // Hindi translation (ht)
          if (authorData.ht && meta.hasHi) {
            await prisma.translation.upsert({
              where: {
                verseId_authorKey_language: {
                  verseId: verse.id,
                  authorKey: key,
                  language: "hi",
                },
              },
              update: { text: authorData.ht },
              create: {
                language: "hi",
                text: authorData.ht,
                authorName: meta.name,
                authorKey: key,
                verseId: verse.id,
              },
            });
            translationsSeeded++;
          }

          // English commentary (ec)
          if (authorData.ec) {
            await prisma.commentary.upsert({
              where: {
                verseId_authorKey_language: {
                  verseId: verse.id,
                  authorKey: key,
                  language: "en",
                },
              },
              update: { text: authorData.ec },
              create: {
                language: "en",
                text: authorData.ec,
                authorName: meta.name,
                authorKey: key,
                school: meta.school || null,
                verseId: verse.id,
              },
            });
            commentariesSeeded++;
          }

          // Hindi commentary (hc)
          if (authorData.hc) {
            await prisma.commentary.upsert({
              where: {
                verseId_authorKey_language: {
                  verseId: verse.id,
                  authorKey: key,
                  language: "hi",
                },
              },
              update: { text: authorData.hc },
              create: {
                language: "hi",
                text: authorData.hc,
                authorName: meta.name,
                authorKey: key,
                school: meta.school || null,
                verseId: verse.id,
              },
            });
            commentariesSeeded++;
          }

          // Sanskrit commentary (sc)
          if (authorData.sc && meta.hasSanskrit) {
            await prisma.commentary.upsert({
              where: {
                verseId_authorKey_language: {
                  verseId: verse.id,
                  authorKey: key,
                  language: "sa",
                },
              },
              update: { text: authorData.sc },
              create: {
                language: "sa",
                text: authorData.sc,
                authorName: meta.name,
                authorKey: key,
                school: meta.school || null,
                verseId: verse.id,
              },
            });
            commentariesSeeded++;
          }
        }
      } catch (error) {
        console.error(
          `      ⚠️  Error fetching verse ${chData.chapter_number}.${v}:`,
          error instanceof Error ? error.message : error
        );
      }
    }

    console.log(
      `      ✅ ${versesSeeded} verses, ${translationsSeeded} translations, ${commentariesSeeded} commentaries\n`
    );
  }

  // ---- Final counts ----
  const totalVerses = await prisma.verse.count();
  const totalTranslations = await prisma.translation.count();
  const totalCommentaries = await prisma.commentary.count();

  console.log("\n🎉 Seeding complete!");
  console.log("===================");
  console.log(`   📜 1 Scripture`);
  console.log(`   📕 ${chaptersData.length} Chapters`);
  console.log(`   📝 ${totalVerses} Verses`);
  console.log(`   🌐 ${totalTranslations} Translations`);
  console.log(`   📚 ${totalCommentaries} Commentaries`);
}

seed()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
