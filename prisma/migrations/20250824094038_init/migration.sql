-- CreateEnum
CREATE TYPE "public"."InstitutionStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "public"."EmployeeRole" AS ENUM ('ADMIN', 'DISTRIBUTER', 'PUBLISHER');

-- CreateEnum
CREATE TYPE "public"."EmployeeStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "public"."DistributionStatus" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."RoundStatus" AS ENUM ('PENDING', 'ACTIVE', 'COMPLETED');

-- CreateEnum
CREATE TYPE "public"."CouponType" AS ENUM ('CASH', 'FOOD', 'SHOPPING', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."TargetCategory" AS ENUM ('GENERAL', 'LOW_INCOME', 'SPECIAL_NEEDS', 'CHRONIC_DISEASE', 'MARTYRS_FAMILIES', 'ORPHANS');

-- CreateEnum
CREATE TYPE "public"."RoundBeneficiaryStatus" AS ENUM ('PENDING', 'DELIVERED', 'MISSED');

-- CreateTable
CREATE TABLE "public"."Institution" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "status" "public"."InstitutionStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Institution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Employee" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."EmployeeRole",
    "status" "public"."EmployeeStatus" NOT NULL DEFAULT 'ACTIVE',
    "institutionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Beneficiary" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "nationalId" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "password" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Beneficiary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CouponTemplate" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."CouponType" NOT NULL DEFAULT 'OTHER',
    "value" DECIMAL(12,2),
    "currency" TEXT,
    "vendorName" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CouponTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Distribution" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."DistributionStatus" NOT NULL DEFAULT 'DRAFT',
    "couponTemplateId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Distribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Round" (
    "id" TEXT NOT NULL,
    "distributionId" TEXT NOT NULL,
    "roundNumber" INTEGER NOT NULL,
    "targetCategory" "public"."TargetCategory" NOT NULL DEFAULT 'GENERAL',
    "couponCount" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "public"."RoundStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Round_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RoundBeneficiary" (
    "id" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    "beneficiaryId" TEXT NOT NULL,
    "couponCode" TEXT NOT NULL,
    "status" "public"."RoundBeneficiaryStatus" NOT NULL DEFAULT 'PENDING',
    "deliveredAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoundBeneficiary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Institution_email_key" ON "public"."Institution"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_institutionId_email_key" ON "public"."Employee"("institutionId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Beneficiary_nationalId_key" ON "public"."Beneficiary"("nationalId");

-- CreateIndex
CREATE UNIQUE INDEX "CouponTemplate_institutionId_name_key" ON "public"."CouponTemplate"("institutionId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Round_distributionId_roundNumber_key" ON "public"."Round"("distributionId", "roundNumber");

-- CreateIndex
CREATE UNIQUE INDEX "RoundBeneficiary_roundId_beneficiaryId_key" ON "public"."RoundBeneficiary"("roundId", "beneficiaryId");

-- CreateIndex
CREATE UNIQUE INDEX "RoundBeneficiary_couponCode_key" ON "public"."RoundBeneficiary"("couponCode");

-- AddForeignKey
ALTER TABLE "public"."Employee" ADD CONSTRAINT "Employee_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "public"."Institution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CouponTemplate" ADD CONSTRAINT "CouponTemplate_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "public"."Institution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Distribution" ADD CONSTRAINT "Distribution_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "public"."Institution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Distribution" ADD CONSTRAINT "Distribution_couponTemplateId_fkey" FOREIGN KEY ("couponTemplateId") REFERENCES "public"."CouponTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Round" ADD CONSTRAINT "Round_distributionId_fkey" FOREIGN KEY ("distributionId") REFERENCES "public"."Distribution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RoundBeneficiary" ADD CONSTRAINT "RoundBeneficiary_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "public"."Round"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RoundBeneficiary" ADD CONSTRAINT "RoundBeneficiary_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "public"."Beneficiary"("id") ON DELETE CASCADE ON UPDATE CASCADE;
