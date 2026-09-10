-- CreateEnum
CREATE TYPE "BranchType" AS ENUM ('PRIMARY', 'STANDARD');

-- AlterTable
ALTER TABLE "Branch" ADD COLUMN     "type" "BranchType" NOT NULL DEFAULT 'PRIMARY';

-- CreateTable
CREATE TABLE "DomainEvent" (
    "id" CHAR(32) NOT NULL,
    "aggregateId" TEXT NOT NULL,
    "aggregateType" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "DomainEvent_pkey" PRIMARY KEY ("id")
);
