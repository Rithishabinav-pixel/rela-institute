CREATE TABLE "doctor_articles" (
    "doctorId" INTEGER NOT NULL,
    "articleSlug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "doctor_articles_pkey" PRIMARY KEY ("doctorId","articleSlug")
);

ALTER TABLE "doctor_articles" ADD CONSTRAINT "doctor_articles_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
