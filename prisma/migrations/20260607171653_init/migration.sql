-- CreateTable
CREATE TABLE "scriptures" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_hi" TEXT,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "description_hi" TEXT,
    "total_chapters" INTEGER NOT NULL DEFAULT 0,
    "total_verses" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scriptures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chapters" (
    "id" TEXT NOT NULL,
    "chapter_number" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "transliteration" TEXT NOT NULL,
    "meaning_en" TEXT,
    "meaning_hi" TEXT,
    "summary_en" TEXT,
    "summary_hi" TEXT,
    "verses_count" INTEGER NOT NULL DEFAULT 0,
    "scripture_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chapters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verses" (
    "id" TEXT NOT NULL,
    "verse_number" INTEGER NOT NULL,
    "verse_id" TEXT NOT NULL,
    "slok" TEXT NOT NULL,
    "transliteration" TEXT NOT NULL,
    "word_meanings" TEXT,
    "chapter_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "translations" (
    "id" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "author_name" TEXT NOT NULL,
    "author_key" TEXT NOT NULL,
    "verse_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commentaries" (
    "id" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "author_name" TEXT NOT NULL,
    "author_key" TEXT NOT NULL,
    "school" TEXT,
    "verse_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "commentaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "email_verified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "bookmarks" (
    "id" TEXT NOT NULL,
    "note" TEXT,
    "user_id" TEXT NOT NULL,
    "verse_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "read_progress" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "chapter_number" INTEGER NOT NULL,
    "verse_number" INTEGER NOT NULL,
    "read_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "read_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "scriptures_name_key" ON "scriptures"("name");

-- CreateIndex
CREATE UNIQUE INDEX "scriptures_slug_key" ON "scriptures"("slug");

-- CreateIndex
CREATE INDEX "chapters_chapter_number_idx" ON "chapters"("chapter_number");

-- CreateIndex
CREATE UNIQUE INDEX "chapters_scripture_id_chapter_number_key" ON "chapters"("scripture_id", "chapter_number");

-- CreateIndex
CREATE UNIQUE INDEX "verses_verse_id_key" ON "verses"("verse_id");

-- CreateIndex
CREATE INDEX "verses_verse_number_idx" ON "verses"("verse_number");

-- CreateIndex
CREATE INDEX "verses_verse_id_idx" ON "verses"("verse_id");

-- CreateIndex
CREATE UNIQUE INDEX "verses_chapter_id_verse_number_key" ON "verses"("chapter_id", "verse_number");

-- CreateIndex
CREATE INDEX "translations_language_idx" ON "translations"("language");

-- CreateIndex
CREATE INDEX "translations_author_key_idx" ON "translations"("author_key");

-- CreateIndex
CREATE UNIQUE INDEX "translations_verse_id_author_key_language_key" ON "translations"("verse_id", "author_key", "language");

-- CreateIndex
CREATE INDEX "commentaries_language_idx" ON "commentaries"("language");

-- CreateIndex
CREATE INDEX "commentaries_author_key_idx" ON "commentaries"("author_key");

-- CreateIndex
CREATE INDEX "commentaries_school_idx" ON "commentaries"("school");

-- CreateIndex
CREATE UNIQUE INDEX "commentaries_verse_id_author_key_language_key" ON "commentaries"("verse_id", "author_key", "language");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE INDEX "bookmarks_user_id_idx" ON "bookmarks"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "bookmarks_user_id_verse_id_key" ON "bookmarks"("user_id", "verse_id");

-- CreateIndex
CREATE INDEX "read_progress_user_id_idx" ON "read_progress"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "read_progress_user_id_chapter_number_verse_number_key" ON "read_progress"("user_id", "chapter_number", "verse_number");

-- AddForeignKey
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_scripture_id_fkey" FOREIGN KEY ("scripture_id") REFERENCES "scriptures"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verses" ADD CONSTRAINT "verses_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "translations" ADD CONSTRAINT "translations_verse_id_fkey" FOREIGN KEY ("verse_id") REFERENCES "verses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentaries" ADD CONSTRAINT "commentaries_verse_id_fkey" FOREIGN KEY ("verse_id") REFERENCES "verses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_verse_id_fkey" FOREIGN KEY ("verse_id") REFERENCES "verses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "read_progress" ADD CONSTRAINT "read_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
