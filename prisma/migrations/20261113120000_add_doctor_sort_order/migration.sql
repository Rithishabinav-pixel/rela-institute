ALTER TABLE "doctors" ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0;

UPDATE "doctors" AS d
SET "sortOrder" = sub.rn - 1
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY name ASC) AS rn
  FROM "doctors"
) AS sub
WHERE d.id = sub.id;
