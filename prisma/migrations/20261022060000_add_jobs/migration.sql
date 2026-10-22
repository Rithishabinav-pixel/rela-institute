CREATE TABLE "job_titles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "nameNormalized" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_titles_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "job_titles_nameNormalized_key" ON "job_titles"("nameNormalized");

CREATE TABLE "job_categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "nameNormalized" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_categories_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "job_categories_nameNormalized_key" ON "job_categories"("nameNormalized");

CREATE TABLE "job_locations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "nameNormalized" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_locations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "job_locations_nameNormalized_key" ON "job_locations"("nameNormalized");

CREATE TABLE "jobs" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "jobTitleId" INTEGER NOT NULL,
    "jobCategoryId" INTEGER NOT NULL,
    "jobLocationId" INTEGER NOT NULL,
    "experience" TEXT NOT NULL,
    "education" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "jobs_slug_key" ON "jobs"("slug");

ALTER TABLE "jobs" ADD CONSTRAINT "jobs_jobTitleId_fkey" FOREIGN KEY ("jobTitleId") REFERENCES "job_titles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_jobCategoryId_fkey" FOREIGN KEY ("jobCategoryId") REFERENCES "job_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_jobLocationId_fkey" FOREIGN KEY ("jobLocationId") REFERENCES "job_locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
