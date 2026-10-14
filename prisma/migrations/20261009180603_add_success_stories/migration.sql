-- CreateTable
CREATE TABLE "success_stories" (
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
    "quickSearch" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "success_stories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "success_story_departments" (
    "successStoryId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,

    CONSTRAINT "success_story_departments_pkey" PRIMARY KEY ("successStoryId","departmentId")
);

-- CreateTable
CREATE TABLE "success_story_doctors" (
    "successStoryId" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL,

    CONSTRAINT "success_story_doctors_pkey" PRIMARY KEY ("successStoryId","doctorId")
);

-- CreateTable
CREATE TABLE "success_story_gallery_images" (
    "id" SERIAL NOT NULL,
    "successStoryId" INTEGER NOT NULL,
    "imagePath" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "altText" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "success_story_gallery_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "success_stories_slug_key" ON "success_stories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "success_stories_pageLink_key" ON "success_stories"("pageLink");

-- AddForeignKey
ALTER TABLE "success_story_departments" ADD CONSTRAINT "success_story_departments_successStoryId_fkey" FOREIGN KEY ("successStoryId") REFERENCES "success_stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "success_story_departments" ADD CONSTRAINT "success_story_departments_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "success_story_doctors" ADD CONSTRAINT "success_story_doctors_successStoryId_fkey" FOREIGN KEY ("successStoryId") REFERENCES "success_stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "success_story_doctors" ADD CONSTRAINT "success_story_doctors_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "success_story_gallery_images" ADD CONSTRAINT "success_story_gallery_images_successStoryId_fkey" FOREIGN KEY ("successStoryId") REFERENCES "success_stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
