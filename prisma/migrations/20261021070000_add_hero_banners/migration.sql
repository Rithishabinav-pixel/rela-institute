CREATE TABLE "hero_banners" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'content',
    "title" TEXT,
    "fancyText" TEXT,
    "description" TEXT,
    "buttonText" TEXT,
    "buttonType" TEXT DEFAULT 'common',
    "buttonLink" TEXT,
    "desktopImage" TEXT,
    "mobileImage" TEXT,
    "bannerLink" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hero_banners_pkey" PRIMARY KEY ("id")
);
