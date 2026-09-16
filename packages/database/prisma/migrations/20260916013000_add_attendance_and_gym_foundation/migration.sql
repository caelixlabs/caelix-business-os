-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED');

-- CreateEnum
CREATE TYPE "GymMemberStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'FROZEN', 'CANCELLED');

-- CreateEnum
CREATE TYPE "GymClassStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "Attendance" (
    "id" CHAR(32) NOT NULL,
    "organizationId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "contextId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "AttendanceStatus" NOT NULL DEFAULT 'PRESENT',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GymMember" (
    "id" CHAR(32) NOT NULL,
    "organizationId" TEXT NOT NULL,
    "branchId" TEXT,
    "contactId" TEXT NOT NULL,
    "memberNo" TEXT NOT NULL,
    "status" "GymMemberStatus" NOT NULL DEFAULT 'ACTIVE',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GymMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GymClass" (
    "id" CHAR(32) NOT NULL,
    "organizationId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "trainerUserId" TEXT,
    "name" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 20,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "days" TEXT[],
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "status" "GymClassStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GymClass_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Attendance_organizationId_date_idx" ON "Attendance"("organizationId", "date");

-- CreateIndex
CREATE INDEX "Attendance_organizationId_context_contextId_date_idx" ON "Attendance"("organizationId", "context", "contextId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_contactId_context_contextId_date_key" ON "Attendance"("contactId", "context", "contextId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "GymMember_contactId_key" ON "GymMember"("contactId");

-- CreateIndex
CREATE INDEX "GymMember_organizationId_idx" ON "GymMember"("organizationId");

-- CreateIndex
CREATE INDEX "GymMember_organizationId_branchId_idx" ON "GymMember"("organizationId", "branchId");

-- CreateIndex
CREATE INDEX "GymMember_organizationId_status_idx" ON "GymMember"("organizationId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "GymMember_organizationId_memberNo_key" ON "GymMember"("organizationId", "memberNo");

-- CreateIndex
CREATE INDEX "GymClass_organizationId_idx" ON "GymClass"("organizationId");

-- CreateIndex
CREATE INDEX "GymClass_organizationId_branchId_idx" ON "GymClass"("organizationId", "branchId");

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GymMember" ADD CONSTRAINT "GymMember_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GymMember" ADD CONSTRAINT "GymMember_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GymMember" ADD CONSTRAINT "GymMember_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GymClass" ADD CONSTRAINT "GymClass_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GymClass" ADD CONSTRAINT "GymClass_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GymClass" ADD CONSTRAINT "GymClass_trainerUserId_fkey" FOREIGN KEY ("trainerUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
