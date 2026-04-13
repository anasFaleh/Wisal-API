/*
  Warnings:

  - You are about to drop the column `latitude` on the `Beneficiary` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Beneficiary` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Beneficiary" DROP COLUMN "latitude",
DROP COLUMN "longitude",
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "healthStatus" "public"."HealthStatus" NOT NULL DEFAULT 'NORMAL';
