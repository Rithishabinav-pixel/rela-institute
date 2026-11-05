ALTER TABLE "health_packages" DROP COLUMN "tag";
ALTER TABLE "health_packages" ADD COLUMN "isPopular" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "health_packages" ADD COLUMN "metaTitle" TEXT;
ALTER TABLE "health_packages" ADD COLUMN "metaDescription" TEXT;
ALTER TABLE "health_packages" ADD COLUMN "canonicalUrl" TEXT;
