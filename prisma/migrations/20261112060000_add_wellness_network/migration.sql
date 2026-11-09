CREATE TABLE "wellness_network" (
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

    CONSTRAINT "wellness_network_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "wellness_network_departments" (
    "wellnessNetworkId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,

    CONSTRAINT "wellness_network_departments_pkey" PRIMARY KEY ("wellnessNetworkId","departmentId")
);

CREATE TABLE "wellness_network_doctors" (
    "wellnessNetworkId" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL,

    CONSTRAINT "wellness_network_doctors_pkey" PRIMARY KEY ("wellnessNetworkId","doctorId")
);

CREATE TABLE "wellness_network_gallery_images" (
    "id" SERIAL NOT NULL,
    "wellnessNetworkId" INTEGER NOT NULL,
    "imagePath" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "altText" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wellness_network_gallery_images_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "wellness_network_slug_key" ON "wellness_network"("slug");
CREATE UNIQUE INDEX "wellness_network_pageLink_key" ON "wellness_network"("pageLink");

ALTER TABLE "wellness_network_departments" ADD CONSTRAINT "wellness_network_departments_wellnessNetworkId_fkey" FOREIGN KEY ("wellnessNetworkId") REFERENCES "wellness_network"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "wellness_network_departments" ADD CONSTRAINT "wellness_network_departments_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "wellness_network_doctors" ADD CONSTRAINT "wellness_network_doctors_wellnessNetworkId_fkey" FOREIGN KEY ("wellnessNetworkId") REFERENCES "wellness_network"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "wellness_network_doctors" ADD CONSTRAINT "wellness_network_doctors_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "wellness_network_gallery_images" ADD CONSTRAINT "wellness_network_gallery_images_wellnessNetworkId_fkey" FOREIGN KEY ("wellnessNetworkId") REFERENCES "wellness_network"("id") ON DELETE CASCADE ON UPDATE CASCADE;
