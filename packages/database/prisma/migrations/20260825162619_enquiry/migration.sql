-- CreateEnum
CREATE TYPE "EnquiryStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST');

-- CreateEnum
CREATE TYPE "EnquirySource" AS ENUM ('WEBSITE', 'PHONE', 'EMAIL', 'WALK_IN', 'REFERRAL', 'SOCIAL_MEDIA', 'OTHER');

-- CreateTable
CREATE TABLE "Enquiry" (
    "id" CHAR(32) NOT NULL,
    "organizationId" TEXT NOT NULL,
    "branchId" TEXT,
    "contactId" TEXT NOT NULL,
    "assignedUserId" TEXT,
    "source" "EnquirySource" NOT NULL,
    "status" "EnquiryStatus" NOT NULL DEFAULT 'NEW',
    "subject" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Enquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Enquiry_organizationId_idx" ON "Enquiry"("organizationId");

-- CreateIndex
CREATE INDEX "Enquiry_organizationId_branchId_idx" ON "Enquiry"("organizationId", "branchId");

-- CreateIndex
CREATE INDEX "Enquiry_organizationId_contactId_idx" ON "Enquiry"("organizationId", "contactId");

-- CreateIndex
CREATE INDEX "Enquiry_organizationId_status_idx" ON "Enquiry"("organizationId", "status");

-- CreateIndex
CREATE INDEX "Enquiry_assignedUserId_idx" ON "Enquiry"("assignedUserId");

-- AddForeignKey
ALTER TABLE "Enquiry" ADD CONSTRAINT "Enquiry_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enquiry" ADD CONSTRAINT "Enquiry_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enquiry" ADD CONSTRAINT "Enquiry_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enquiry" ADD CONSTRAINT "Enquiry_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
