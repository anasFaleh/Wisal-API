/*
  Warnings:

  - You are about to drop the column `targetCategory` on the `Round` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Beneficiary" ADD COLUMN     "income" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."Round" DROP COLUMN "targetCategory";

-- DropEnum
DROP TYPE "public"."TargetCategory";
