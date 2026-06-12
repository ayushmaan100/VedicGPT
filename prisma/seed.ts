import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '../src/generated/prisma/client';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/vedicgpt?schema=public',
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function fetchJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
  return res.json();
}

async function main() {
  console.log('🕉  VedicGPT Data Seeder (gita/gita dataset)');
  console.log('============================================\n');

  try {
    // 1. Create Scripture
    console.log('📜 Creating Bhagavad Gita scripture entry...');
    let gita = await prisma.scripture.findUnique({ where: { slug: 'bhagavad-gita' } });
    if (!gita) {
      gita = await prisma.scripture.create({
        data: {
          name: 'Bhagavad Gita',
          nameHi: 'भगवद्गीता',
          slug: 'bhagavad-gita',
          description: 'The Song of God',
          descriptionHi: 'भगवान का गीत',
          totalChapters: 18,
          totalVerses: 700,
        },
      });
    }

    // Fetch datasets
    console.log('📥 Downloading datasets from gita/gita repository (this may take a moment)...');
    
    console.log('   - Fetching chapters.json');
    const chaptersData = await fetchJson('https://raw.githubusercontent.com/gita/gita/main/data/chapters.json');
    
    console.log('   - Fetching verse.json');
    const versesData = await fetchJson('https://raw.githubusercontent.com/gita/gita/main/data/verse.json');
    
    console.log('   - Fetching translation.json');
    const translationsData = await fetchJson('https://raw.githubusercontent.com/gita/gita/main/data/translation.json');
    
    console.log('   - Fetching commentary.json (28MB)');
    const commentariesData = await fetchJson('https://raw.githubusercontent.com/gita/gita/main/data/commentary.json');

    console.log('✅ Datasets downloaded successfully.\n');

    // 2. Insert Chapters
    console.log('📖 Processing Chapters...');
    const chapterMap = new Map<number, string>(); // chapter_number -> ourChapterId

    for (const ch of chaptersData) {
      const chapter = await prisma.chapter.create({
        data: {
          scriptureId: gita.id,
          chapterNumber: ch.chapter_number,
          name: ch.name || `Chapter ${ch.chapter_number}`,
          translation: ch.name_translation || `Chapter ${ch.chapter_number}`,
          transliteration: ch.name_meaning || '',
          meaningEn: ch.name_meaning || '',
          meaningHi: ch.name || '',
          summaryEn: ch.chapter_summary || '',
          summaryHi: ch.chapter_summary_hindi || '',
          versesCount: ch.verses_count || 0,
        },
      });
      chapterMap.set(ch.chapter_number, chapter.id);
    }
    console.log(`   ✅ Inserted ${chaptersData.length} chapters.`);

    // 3. Insert Verses
    console.log('📖 Processing Verses...');
    const verseIdMap = new Map<number, string>(); // gita/gita verse_id -> ourVerseId

    for (const v of versesData) {
      const chapterId = chapterMap.get(v.chapter_number);
      if (!chapterId) continue;

      const verse = await prisma.verse.create({
        data: {
          chapterId: chapterId,
          verseNumber: v.verse_number,
          verseId: `BG${v.chapter_number}.${v.verse_number}`,
          slok: v.text || '',
          transliteration: v.transliteration || '',
          wordMeanings: v.word_meanings || '',
        },
      });
      verseIdMap.set(v.id, verse.id);
    }
    console.log(`   ✅ Inserted ${versesData.length} verses.`);

    // 4. Process Translations (Batching for performance)
    console.log('🌐 Processing Translations...');
    let translationCount = 0;
    const translationBatches = [];
    let currentBatch: any[] = [];

    for (const t of translationsData) {
      const ourVerseId = verseIdMap.get(t.verse_id);
      if (!ourVerseId) continue;

      currentBatch.push({
        verseId: ourVerseId,
        language: t.lang === 'hindi' ? 'hi' : t.lang === 'sanskrit' ? 'sa' : 'en',
        text: t.description || '',
        authorName: t.authorName || 'Unknown',
        authorKey: t.authorName ? t.authorName.toLowerCase().replace(/\\s+/g, '-') : 'unknown',
      });

      if (currentBatch.length >= 2000) {
        translationBatches.push(currentBatch);
        currentBatch = [];
      }
    }
    if (currentBatch.length > 0) translationBatches.push(currentBatch);

    for (const batch of translationBatches) {
      // Prisma createMany is not fully supported by pg adapter in all cases, so we loop or do createMany
      await prisma.translation.createMany({
        data: batch,
        skipDuplicates: true,
      });
      translationCount += batch.length;
    }
    console.log(`   ✅ Inserted ${translationCount} translations.`);

    // 5. Process Commentaries (Batching)
    console.log('📚 Processing Commentaries...');
    let commentaryCount = 0;
    const commentaryBatches = [];
    currentBatch = [];

    for (const c of commentariesData) {
      const ourVerseId = verseIdMap.get(c.verse_id);
      if (!ourVerseId) continue;

      currentBatch.push({
        verseId: ourVerseId,
        language: c.lang === 'hindi' ? 'hi' : c.lang === 'sanskrit' ? 'sa' : 'en',
        text: c.description || '',
        authorName: c.authorName || 'Unknown',
        authorKey: c.authorName ? c.authorName.toLowerCase().replace(/\\s+/g, '-') : 'unknown',
        school: null,
      });

      if (currentBatch.length >= 2000) {
        commentaryBatches.push(currentBatch);
        currentBatch = [];
      }
    }
    if (currentBatch.length > 0) commentaryBatches.push(currentBatch);

    for (let i = 0; i < commentaryBatches.length; i++) {
      const batch = commentaryBatches[i];
      await prisma.commentary.createMany({
        data: batch,
        skipDuplicates: true,
      });
      commentaryCount += batch.length;
      process.stdout.write(`\r   Progress: ${Math.round(((i + 1) / commentaryBatches.length) * 100)}% (${commentaryCount} inserted)`);
    }
    console.log(`\n   ✅ Inserted ${commentaryCount} commentaries.`);

    console.log('\n🎉 Seeding complete!');

  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
