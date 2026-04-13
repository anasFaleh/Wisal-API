/*
  Warnings:

  - You are about to drop the column `active` on the `CouponTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `CouponTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `CouponTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `vendorName` on the `CouponTemplate` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."CouponTemplate_institutionId_name_key";

-- AlterTable
ALTER TABLE "public"."CouponTemplate" DROP COLUMN "active",
DROP COLUMN "currency",
DROP COLUMN "value",
DROP COLUMN "vendorName",
ADD COLUMN     "description" TEXT,
ALTER COLUMN "type" DROP DEFAULT;
