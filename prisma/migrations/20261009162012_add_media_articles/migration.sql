-- CreateTable
CREATE TABLE "media_articles" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "featureType" TEXT NOT NULL DEFAULT 'image',
    "featureImage" TEXT,
    "featureImageSourceUrl" TEXT,
    "youtubeUrl" TEXT,
    "readMoreUrl" TEXT,
    "pageLink" TEXT,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_article_departments" (
    "mediaArticleId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,

    CONSTRAINT "media_article_departments_pkey" PRIMARY KEY ("mediaArticleId","departmentId")
);

-- CreateTable
CREATE TABLE "media_article_doctors" (
    "mediaArticleId" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL,

    CONSTRAINT "media_article_doctors_pkey" PRIMARY KEY ("mediaArticleId","doctorId")
);

-- CreateTable
CREATE TABLE "media_article_gallery_images" (
    "id" SERIAL NOT NULL,
    "mediaArticleId" INTEGER NOT NULL,
    "imagePath" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "altText" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_article_gallery_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "media_articles_slug_key" ON "media_articles"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "media_articles_pageLink_key" ON "media_articles"("pageLink");

-- AddForeignKey
ALTER TABLE "media_article_departments" ADD CONSTRAINT "media_article_departments_mediaArticleId_fkey" FOREIGN KEY ("mediaArticleId") REFERENCES "media_articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_article_departments" ADD CONSTRAINT "media_article_departments_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_article_doctors" ADD CONSTRAINT "media_article_doctors_mediaArticleId_fkey" FOREIGN KEY ("mediaArticleId") REFERENCES "media_articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_article_doctors" ADD CONSTRAINT "media_article_doctors_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_article_gallery_images" ADD CONSTRAINT "media_article_gallery_images_mediaArticleId_fkey" FOREIGN KEY ("mediaArticleId") REFERENCES "media_articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
