-- AlterTable
ALTER TABLE "doctors" ADD COLUMN     "quickSearch" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showInHomepage" BOOLEAN NOT NULL DEFAULT false;
