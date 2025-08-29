-- CreateEnum
CREATE TYPE "public"."MessageStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'SENT', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."DeliveryStatus" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED');

-- AlterTable
ALTER TABLE "public"."Message" ADD COLUMN     "status" "public"."MessageStatus" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "public"."MessageDelivery" ADD COLUMN     "status" "public"."DeliveryStatus" NOT NULL DEFAULT 'PENDING';
