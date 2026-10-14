-- CreateTable
CREATE TABLE "departments" (
    "id" SERIAL NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "nameNormalized" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "departments_departmentId_key" ON "departments"("departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "departments_nameNormalized_key" ON "departments"("nameNormalized");
