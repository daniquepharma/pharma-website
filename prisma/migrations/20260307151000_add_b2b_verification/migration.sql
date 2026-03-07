-- AlterTable
ALTER TABLE "User" ADD COLUMN "businessName" TEXT;
ALTER TABLE "User" ADD COLUMN "drugLicense" TEXT;
ALTER TABLE "User" ADD COLUMN "gstNumber" TEXT;
ALTER TABLE "User" ADD COLUMN "isVerified" BOOLEAN NOT NULL DEFAULT false;
