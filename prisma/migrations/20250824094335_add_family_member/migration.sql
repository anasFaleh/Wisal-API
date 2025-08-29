-- CreateEnum
CREATE TYPE "public"."HealthStatus" AS ENUM ('NORMAL', 'CHRONIC_DISEASE', 'SPECIAL_NEEDS', 'MARTYR');

-- CreateEnum
CREATE TYPE "public"."Relation" AS ENUM ('SPOUSE', 'CHILD', 'PARENT');

-- CreateTable
CREATE TABLE "public"."FamilyMember" (
    "id" TEXT NOT NULL,
    "beneficiaryId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "nationalId" TEXT NOT NULL,
    "healthStatus" "public"."HealthStatus" NOT NULL DEFAULT 'NORMAL',
    "relationship" "public"."Relation",
    "dateOfBirth" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FamilyMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FamilyMember_healthStatus_idx" ON "public"."FamilyMember"("healthStatus");

-- CreateIndex
CREATE UNIQUE INDEX "FamilyMember_beneficiaryId_nationalId_key" ON "public"."FamilyMember"("beneficiaryId", "nationalId");

-- AddForeignKey
ALTER TABLE "public"."FamilyMember" ADD CONSTRAINT "FamilyMember_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "public"."Beneficiary"("id") ON DELETE CASCADE ON UPDATE CASCADE;
