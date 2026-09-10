-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('DRAFT', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- CreateTable
CREATE TABLE "Booking" (
    "id" CHAR(32) NOT NULL,
    "organizationId" TEXT NOT NULL,
    "branchId" TEXT,
    "contactId" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'DRAFT',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Booking_organizationId_idx" ON "Booking"("organizationId");

-- CreateIndex
CREATE INDEX "Booking_organizationId_branchId_idx" ON "Booking"("organizationId", "branchId");

-- CreateIndex
CREATE INDEX "Booking_organizationId_contactId_idx" ON "Booking"("organizationId", "contactId");

-- CreateIndex
CREATE INDEX "Booking_organizationId_status_idx" ON "Booking"("organizationId", "status");

-- CreateIndex
CREATE INDEX "Booking_scheduledAt_idx" ON "Booking"("scheduledAt");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
