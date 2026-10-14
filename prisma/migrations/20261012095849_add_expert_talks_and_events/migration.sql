-- CreateTable
CREATE TABLE "expert_talks" (
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
    "quickSearch" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expert_talks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expert_talk_departments" (
    "expertTalkId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,

    CONSTRAINT "expert_talk_departments_pkey" PRIMARY KEY ("expertTalkId","departmentId")
);

-- CreateTable
CREATE TABLE "expert_talk_doctors" (
    "expertTalkId" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL,

    CONSTRAINT "expert_talk_doctors_pkey" PRIMARY KEY ("expertTalkId","doctorId")
);

-- CreateTable
CREATE TABLE "expert_talk_gallery_images" (
    "id" SERIAL NOT NULL,
    "expertTalkId" INTEGER NOT NULL,
    "imagePath" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "altText" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "expert_talk_gallery_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
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
    "quickSearch" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_departments" (
    "eventId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,

    CONSTRAINT "event_departments_pkey" PRIMARY KEY ("eventId","departmentId")
);

-- CreateTable
CREATE TABLE "event_doctors" (
    "eventId" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL,

    CONSTRAINT "event_doctors_pkey" PRIMARY KEY ("eventId","doctorId")
);

-- CreateTable
CREATE TABLE "event_gallery_images" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "imagePath" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "altText" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_gallery_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "expert_talks_slug_key" ON "expert_talks"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "expert_talks_pageLink_key" ON "expert_talks"("pageLink");

-- CreateIndex
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "events_pageLink_key" ON "events"("pageLink");

-- AddForeignKey
ALTER TABLE "expert_talk_departments" ADD CONSTRAINT "expert_talk_departments_expertTalkId_fkey" FOREIGN KEY ("expertTalkId") REFERENCES "expert_talks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_talk_departments" ADD CONSTRAINT "expert_talk_departments_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_talk_doctors" ADD CONSTRAINT "expert_talk_doctors_expertTalkId_fkey" FOREIGN KEY ("expertTalkId") REFERENCES "expert_talks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_talk_doctors" ADD CONSTRAINT "expert_talk_doctors_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_talk_gallery_images" ADD CONSTRAINT "expert_talk_gallery_images_expertTalkId_fkey" FOREIGN KEY ("expertTalkId") REFERENCES "expert_talks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_departments" ADD CONSTRAINT "event_departments_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_departments" ADD CONSTRAINT "event_departments_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_doctors" ADD CONSTRAINT "event_doctors_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_doctors" ADD CONSTRAINT "event_doctors_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_gallery_images" ADD CONSTRAINT "event_gallery_images_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
