CREATE TABLE "contact_enquiries" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "preferredLocation" TEXT,
    "lookingFor" TEXT,
    "message" TEXT,
    "pageUrl" TEXT,
    "emailStatus" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_enquiries_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "career_enquiries" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "jobId" INTEGER,
    "jobTitleSnapshot" TEXT,
    "jobCategorySnapshot" TEXT,
    "jobLocationSnapshot" TEXT,
    "resumePath" TEXT,
    "resumeOriginalName" TEXT,
    "message" TEXT,
    "pageUrl" TEXT,
    "emailStatus" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "career_enquiries_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "content_enquiries" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "country" TEXT,
    "state" TEXT,
    "enquiryType" TEXT,
    "message" TEXT,
    "pageUrl" TEXT,
    "emailStatus" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_enquiries_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "doctor_enquiries" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "country" TEXT,
    "state" TEXT,
    "enquiryType" TEXT,
    "message" TEXT,
    "pageUrl" TEXT,
    "emailStatus" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "doctor_enquiries_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "career_enquiries" ADD CONSTRAINT "career_enquiries_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
