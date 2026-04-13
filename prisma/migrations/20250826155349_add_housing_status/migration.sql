-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "public"."HousingStatus" AS ENUM ('TENT', 'RENT', 'OWNED');

-- AlterTable
ALTER TABLE "public"."Beneficiary" ADD COLUMN     "gender" "public"."Gender",
ADD COLUMN     "housingStatus" "public"."HousingStatus";
