CREATE TABLE "health_packages" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "testName" TEXT NOT NULL,
    "tag" TEXT,
    "discount" TEXT,
    "discountText" TEXT,
    "offerPrice" TEXT NOT NULL,
    "actualPrice" TEXT NOT NULL,
    "testCount" TEXT NOT NULL,
    "disclaimer" TEXT,
    "ageGroup" TEXT,
    "gender" TEXT,
    "fastingFor" TEXT,
    "reportsWithin" TEXT,
    "packageImage" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "health_packages_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "health_packages_slug_key" ON "health_packages"("slug");

CREATE TABLE "health_package_test_groups" (
    "id" SERIAL NOT NULL,
    "healthPackageId" INTEGER NOT NULL,
    "heading" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "health_package_test_groups_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "health_package_tests" (
    "id" SERIAL NOT NULL,
    "groupId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "health_package_tests_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "health_package_faqs" (
    "id" SERIAL NOT NULL,
    "healthPackageId" INTEGER NOT NULL,
    "heading" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "health_package_faqs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "package_enquiries" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "preferredLocation" TEXT,
    "message" TEXT,
    "packageId" INTEGER,
    "packageNameSnapshot" TEXT,
    "packageSlugSnapshot" TEXT,
    "pageUrl" TEXT,
    "emailStatus" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "package_enquiries_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "health_package_test_groups" ADD CONSTRAINT "health_package_test_groups_healthPackageId_fkey" FOREIGN KEY ("healthPackageId") REFERENCES "health_packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "health_package_tests" ADD CONSTRAINT "health_package_tests_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "health_package_test_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "health_package_faqs" ADD CONSTRAINT "health_package_faqs_healthPackageId_fkey" FOREIGN KEY ("healthPackageId") REFERENCES "health_packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "package_enquiries" ADD CONSTRAINT "package_enquiries_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "health_packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
