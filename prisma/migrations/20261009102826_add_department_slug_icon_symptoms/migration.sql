-- AlterTable
ALTER TABLE "departments" ADD COLUMN     "slug" TEXT,
ADD COLUMN     "icon" TEXT;

-- CreateTable
CREATE TABLE "department_symptoms" (
    "id" SERIAL NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "department_symptoms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "departments_slug_key" ON "departments"("slug");

-- AddForeignKey
ALTER TABLE "department_symptoms" ADD CONSTRAINT "department_symptoms_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
