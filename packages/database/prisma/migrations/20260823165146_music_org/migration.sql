-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('NEW', 'CONTACTED', 'TRIAL_SCHEDULED', 'ENROLLED', 'LOST');

-- CreateEnum
CREATE TYPE "SkillLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'EXCUSED', 'LATE');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELLED', 'PAST_DUE');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'ISSUED', 'PAID', 'OVERDUE', 'VOID');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('STRIPE', 'CASH', 'BANK_TRANSFER', 'UPI', 'POS');

-- CreateEnum
CREATE TYPE "MusicStudentStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'GRADUATED', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "MusicSkillLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'PROFESSIONAL');

-- CreateEnum
CREATE TYPE "MusicCourseStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "MusicBatchStatus" AS ENUM ('PLANNED', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MusicEnrollmentStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MusicAttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED');

-- CreateTable
CREATE TABLE "music_inquiries" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "branchId" TEXT,
    "studentName" TEXT NOT NULL,
    "guardianName" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "instrument" TEXT NOT NULL,
    "skillLevel" "SkillLevel" NOT NULL DEFAULT 'BEGINNER',
    "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
    "trialSessionAt" TIMESTAMP(3),
    "notes" TEXT,
    "assignedStaffId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "music_inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "music_courses" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "instrument" TEXT NOT NULL,
    "description" TEXT,
    "skillLevel" "SkillLevel" NOT NULL,
    "isIndividual" BOOLEAN NOT NULL DEFAULT true,
    "maxCapacity" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "music_courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "music_instructor_profiles" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "specialties" TEXT[],
    "hourlyRate" DECIMAL(10,2) NOT NULL,
    "commissionRatePct" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "workingHours" JSONB NOT NULL,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "music_instructor_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "music_student_profiles" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "guardianName" TEXT,
    "guardianPhone" TEXT,
    "guardianEmail" TEXT,
    "emergencyContact" TEXT,
    "dob" TIMESTAMP(3),
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "music_student_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "music_packages" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "discountPrice" DECIMAL(10,2),
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "totalSessions" INTEGER NOT NULL,
    "validityDays" INTEGER NOT NULL,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "music_packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "music_discounts" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "type" "DiscountType" NOT NULL DEFAULT 'PERCENTAGE',
    "value" DECIMAL(10,2) NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "maxUses" INTEGER,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "music_discounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "music_package_discounts" (
    "packageId" TEXT NOT NULL,
    "discountId" TEXT NOT NULL,

    CONSTRAINT "music_package_discounts_pkey" PRIMARY KEY ("packageId","discountId")
);

-- CreateTable
CREATE TABLE "music_subscriptions" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "discountId" TEXT,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "sessionsTotal" INTEGER NOT NULL,
    "sessionsRemaining" INTEGER NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "autoRenew" BOOLEAN NOT NULL DEFAULT false,
    "renewalNotifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "music_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "music_lesson_sessions" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "instructorId" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "title" TEXT NOT NULL,
    "roomNumber" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'SCHEDULED',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "music_lesson_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "music_lesson_attendances" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "status" "AttendanceStatus" NOT NULL DEFAULT 'PRESENT',
    "markedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "remarks" TEXT,
    "homeworkAssigned" TEXT,

    CONSTRAINT "music_lesson_attendances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "music_video_lessons" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "courseId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "videoUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "durationSeconds" INTEGER NOT NULL,
    "attachments" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "music_video_lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "music_invoices" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "invoiceNumber" TEXT NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "discountAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "music_invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "music_payments" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "referenceId" TEXT,
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "music_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MusicStudent" (
    "id" CHAR(32) NOT NULL,
    "organizationId" TEXT NOT NULL,
    "branchId" TEXT,
    "studentNo" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "guardianName" TEXT,
    "guardianPhone" TEXT,
    "guardianEmail" TEXT,
    "instrument" TEXT,
    "skillLevel" "MusicSkillLevel" NOT NULL DEFAULT 'BEGINNER',
    "status" "MusicStudentStatus" NOT NULL DEFAULT 'ACTIVE',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MusicStudent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MusicCourse" (
    "id" CHAR(32) NOT NULL,
    "organizationId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "instrument" TEXT,
    "skillLevel" "MusicSkillLevel" NOT NULL DEFAULT 'BEGINNER',
    "durationWeeks" INTEGER,
    "classDurationMinutes" INTEGER NOT NULL DEFAULT 60,
    "status" "MusicCourseStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MusicCourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MusicBatch" (
    "id" CHAR(32) NOT NULL,
    "organizationId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "teacherUserId" TEXT,
    "name" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 20,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "days" TEXT[],
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "status" "MusicBatchStatus" NOT NULL DEFAULT 'PLANNED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MusicBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MusicEnrollment" (
    "id" CHAR(32) NOT NULL,
    "organizationId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "feeAmount" INTEGER NOT NULL DEFAULT 0,
    "discountAmount" INTEGER NOT NULL DEFAULT 0,
    "status" "MusicEnrollmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MusicEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MusicAttendance" (
    "id" CHAR(32) NOT NULL,
    "organizationId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "MusicAttendanceStatus" NOT NULL DEFAULT 'PRESENT',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MusicAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MusicPracticeLog" (
    "id" CHAR(32) NOT NULL,
    "organizationId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "minutes" INTEGER NOT NULL,
    "instrument" TEXT,
    "piece" TEXT,
    "notes" TEXT,
    "teacherFeedback" TEXT,
    "rating" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MusicPracticeLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "music_inquiries_organizationId_status_idx" ON "music_inquiries"("organizationId", "status");

-- CreateIndex
CREATE INDEX "music_inquiries_organizationId_branchId_idx" ON "music_inquiries"("organizationId", "branchId");

-- CreateIndex
CREATE INDEX "music_courses_organizationId_instrument_idx" ON "music_courses"("organizationId", "instrument");

-- CreateIndex
CREATE UNIQUE INDEX "music_courses_organizationId_slug_key" ON "music_courses"("organizationId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "music_instructor_profiles_userId_key" ON "music_instructor_profiles"("userId");

-- CreateIndex
CREATE INDEX "music_instructor_profiles_organizationId_idx" ON "music_instructor_profiles"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "music_student_profiles_userId_key" ON "music_student_profiles"("userId");

-- CreateIndex
CREATE INDEX "music_student_profiles_organizationId_idx" ON "music_student_profiles"("organizationId");

-- CreateIndex
CREATE INDEX "music_packages_organizationId_courseId_idx" ON "music_packages"("organizationId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "music_discounts_organizationId_code_key" ON "music_discounts"("organizationId", "code");

-- CreateIndex
CREATE INDEX "music_subscriptions_organizationId_status_expiresAt_idx" ON "music_subscriptions"("organizationId", "status", "expiresAt");

-- CreateIndex
CREATE INDEX "music_subscriptions_studentId_idx" ON "music_subscriptions"("studentId");

-- CreateIndex
CREATE INDEX "music_lesson_sessions_organizationId_branchId_startTime_idx" ON "music_lesson_sessions"("organizationId", "branchId", "startTime");

-- CreateIndex
CREATE INDEX "music_lesson_sessions_instructorId_startTime_idx" ON "music_lesson_sessions"("instructorId", "startTime");

-- CreateIndex
CREATE INDEX "music_lesson_attendances_organizationId_studentId_status_idx" ON "music_lesson_attendances"("organizationId", "studentId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "music_lesson_attendances_sessionId_studentId_key" ON "music_lesson_attendances"("sessionId", "studentId");

-- CreateIndex
CREATE INDEX "music_video_lessons_organizationId_courseId_idx" ON "music_video_lessons"("organizationId", "courseId");

-- CreateIndex
CREATE INDEX "music_invoices_organizationId_status_idx" ON "music_invoices"("organizationId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "music_invoices_organizationId_invoiceNumber_key" ON "music_invoices"("organizationId", "invoiceNumber");

-- CreateIndex
CREATE INDEX "music_payments_organizationId_invoiceId_idx" ON "music_payments"("organizationId", "invoiceId");

-- CreateIndex
CREATE INDEX "MusicStudent_organizationId_idx" ON "MusicStudent"("organizationId");

-- CreateIndex
CREATE INDEX "MusicStudent_organizationId_branchId_idx" ON "MusicStudent"("organizationId", "branchId");

-- CreateIndex
CREATE INDEX "MusicStudent_organizationId_status_idx" ON "MusicStudent"("organizationId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "MusicStudent_organizationId_studentNo_key" ON "MusicStudent"("organizationId", "studentNo");

-- CreateIndex
CREATE INDEX "MusicCourse_organizationId_idx" ON "MusicCourse"("organizationId");

-- CreateIndex
CREATE INDEX "MusicCourse_organizationId_status_idx" ON "MusicCourse"("organizationId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "MusicCourse_organizationId_code_key" ON "MusicCourse"("organizationId", "code");

-- CreateIndex
CREATE INDEX "MusicBatch_organizationId_idx" ON "MusicBatch"("organizationId");

-- CreateIndex
CREATE INDEX "MusicBatch_organizationId_branchId_idx" ON "MusicBatch"("organizationId", "branchId");

-- CreateIndex
CREATE INDEX "MusicBatch_organizationId_status_idx" ON "MusicBatch"("organizationId", "status");

-- CreateIndex
CREATE INDEX "MusicEnrollment_organizationId_idx" ON "MusicEnrollment"("organizationId");

-- CreateIndex
CREATE INDEX "MusicEnrollment_organizationId_status_idx" ON "MusicEnrollment"("organizationId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "MusicEnrollment_studentId_batchId_key" ON "MusicEnrollment"("studentId", "batchId");

-- CreateIndex
CREATE INDEX "MusicAttendance_organizationId_date_idx" ON "MusicAttendance"("organizationId", "date");

-- CreateIndex
CREATE INDEX "MusicAttendance_organizationId_batchId_date_idx" ON "MusicAttendance"("organizationId", "batchId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "MusicAttendance_studentId_batchId_date_key" ON "MusicAttendance"("studentId", "batchId", "date");

-- CreateIndex
CREATE INDEX "MusicPracticeLog_organizationId_studentId_date_idx" ON "MusicPracticeLog"("organizationId", "studentId", "date");

-- AddForeignKey
ALTER TABLE "music_inquiries" ADD CONSTRAINT "music_inquiries_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music_inquiries" ADD CONSTRAINT "music_inquiries_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music_courses" ADD CONSTRAINT "music_courses_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music_instructor_profiles" ADD CONSTRAINT "music_instructor_profiles_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music_instructor_profiles" ADD CONSTRAINT "music_instructor_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music_student_profiles" ADD CONSTRAINT "music_student_profiles_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music_student_profiles" ADD CONSTRAINT "music_student_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music_packages" ADD CONSTRAINT "music_packages_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music_packages" ADD CONSTRAINT "music_packages_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "music_courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music_discounts" ADD CONSTRAINT "music_discounts_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music_package_discounts" ADD CONSTRAINT "music_package_discounts_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "music_packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music_package_discounts" ADD CONSTRAINT "music_package_discounts_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "music_discounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music_subscriptions" ADD CONSTRAINT "music_subscriptions_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music_subscriptions" ADD CONSTRAINT "music_subscriptions_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "music_student_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music_subscriptions" ADD CONSTRAINT "music_subscriptions_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "music_packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music_subscriptions" ADD CONSTRAINT "music_subscriptions_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "music_discounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music_lesson_sessions" ADD CONSTRAINT "music_lesson_sessions_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music_lesson_sessions" ADD CONSTRAINT "music_lesson_sessions_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music_lesson_sessions" ADD CONSTRAINT "music_lesson_sessions_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "music_courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music_lesson_sessions" ADD CONSTRAINT "music_lesson_sessions_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "music_instructor_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music_lesson_sessions" ADD CONSTRAINT "music_lesson_sessions_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "music_subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music_lesson_attendances" ADD CONSTRAINT "music_lesson_attendances_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music_lesson_attendances" ADD CONSTRAINT "music_lesson_attendances_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "music_lesson_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music_lesson_attendances" ADD CONSTRAINT "music_lesson_attendances_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "music_student_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music_video_lessons" ADD CONSTRAINT "music_video_lessons_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music_video_lessons" ADD CONSTRAINT "music_video_lessons_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "music_courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music_invoices" ADD CONSTRAINT "music_invoices_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music_invoices" ADD CONSTRAINT "music_invoices_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "music_subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music_payments" ADD CONSTRAINT "music_payments_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music_payments" ADD CONSTRAINT "music_payments_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "music_invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicStudent" ADD CONSTRAINT "MusicStudent_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicStudent" ADD CONSTRAINT "MusicStudent_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicCourse" ADD CONSTRAINT "MusicCourse_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicBatch" ADD CONSTRAINT "MusicBatch_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicBatch" ADD CONSTRAINT "MusicBatch_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicBatch" ADD CONSTRAINT "MusicBatch_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "MusicCourse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicBatch" ADD CONSTRAINT "MusicBatch_teacherUserId_fkey" FOREIGN KEY ("teacherUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicEnrollment" ADD CONSTRAINT "MusicEnrollment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicEnrollment" ADD CONSTRAINT "MusicEnrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "MusicStudent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicEnrollment" ADD CONSTRAINT "MusicEnrollment_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "MusicBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicAttendance" ADD CONSTRAINT "MusicAttendance_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicAttendance" ADD CONSTRAINT "MusicAttendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "MusicStudent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicAttendance" ADD CONSTRAINT "MusicAttendance_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "MusicBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicPracticeLog" ADD CONSTRAINT "MusicPracticeLog_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicPracticeLog" ADD CONSTRAINT "MusicPracticeLog_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "MusicStudent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
