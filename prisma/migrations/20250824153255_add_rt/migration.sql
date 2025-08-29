/*
  Warnings:

  - You are about to drop the column `address` on the `Institution` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Employee" ADD COLUMN     "RT" TEXT;

-- AlterTable
ALTER TABLE "public"."Institution" DROP COLUMN "address",
ALTER COLUMN "status" SET DEFAULT 'INACTIVE';
