-- AlterTable: new media articles/success stories no longer default into Quick Search
ALTER TABLE "media_articles" ALTER COLUMN "quickSearch" SET DEFAULT false;
ALTER TABLE "success_stories" ALTER COLUMN "quickSearch" SET DEFAULT false;

-- Data fix: Quick Search previously (incorrectly) also gated the main public listing,
-- so every row was backfilled to true just to avoid emptying the listings. Now that the
-- main listing no longer depends on this flag, reset all existing rows to disabled so an
-- admin opts individual records into Quick Search deliberately.
UPDATE "media_articles" SET "quickSearch" = false;
UPDATE "success_stories" SET "quickSearch" = false;
