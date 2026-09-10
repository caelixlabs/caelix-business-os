-- CreateEnum
CREATE TYPE "IndustryType" AS ENUM ('MUSIC_ORG', 'GYM');

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN "industry" "IndustryType";