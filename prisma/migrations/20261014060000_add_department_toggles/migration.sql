-- Adds the "Show in Homepage" and "Center of Excellence" toggles to departments.
ALTER TABLE "departments" ADD COLUMN "showInHomepage" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "departments" ADD COLUMN "centerOfExcellence" BOOLEAN NOT NULL DEFAULT false;
