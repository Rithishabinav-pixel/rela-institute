-- CreateTable
CREATE TABLE "translation_cache" (
    "id" SERIAL NOT NULL,
    "sourceHash" TEXT NOT NULL,
    "targetLocale" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL DEFAULT 'text/plain',
    "sourceText" TEXT NOT NULL,
    "translatedText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "translation_cache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "translation_cache_sourceHash_targetLocale_mimeType_key" ON "translation_cache"("sourceHash", "targetLocale", "mimeType");
