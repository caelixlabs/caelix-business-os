/*
  Warnings:

  - You are about to drop the `music_courses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `music_discounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `music_inquiries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `music_instructor_profiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `music_invoices` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `music_lesson_attendances` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `music_lesson_sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `music_package_discounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `music_packages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `music_payments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `music_student_profiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `music_subscriptions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `music_video_lessons` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."music_courses" DROP CONSTRAINT "music_courses_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."music_discounts" DROP CONSTRAINT "music_discounts_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."music_inquiries" DROP CONSTRAINT "music_inquiries_branchId_fkey";

-- DropForeignKey
ALTER TABLE "public"."music_inquiries" DROP CONSTRAINT "music_inquiries_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."music_instructor_profiles" DROP CONSTRAINT "music_instructor_profiles_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."music_instructor_profiles" DROP CONSTRAINT "music_instructor_profiles_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."music_invoices" DROP CONSTRAINT "music_invoices_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."music_invoices" DROP CONSTRAINT "music_invoices_subscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."music_lesson_attendances" DROP CONSTRAINT "music_lesson_attendances_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."music_lesson_attendances" DROP CONSTRAINT "music_lesson_attendances_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."music_lesson_attendances" DROP CONSTRAINT "music_lesson_attendances_studentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."music_lesson_sessions" DROP CONSTRAINT "music_lesson_sessions_branchId_fkey";

-- DropForeignKey
ALTER TABLE "public"."music_lesson_sessions" DROP CONSTRAINT "music_lesson_sessions_courseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."music_lesson_sessions" DROP CONSTRAINT "music_lesson_sessions_instructorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."music_lesson_sessions" DROP CONSTRAINT "music_lesson_sessions_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."music_lesson_sessions" DROP CONSTRAINT "music_lesson_sessions_subscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."music_package_discounts" DROP CONSTRAINT "music_package_discounts_discountId_fkey";

-- DropForeignKey
ALTER TABLE "public"."music_package_discounts" DROP CONSTRAINT "music_package_discounts_packageId_fkey";

-- DropForeignKey
ALTER TABLE "public"."music_packages" DROP CONSTRAINT "music_packages_courseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."music_packages" DROP CONSTRAINT "music_packages_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."music_payments" DROP CONSTRAINT "music_payments_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "public"."music_payments" DROP CONSTRAINT "music_payments_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."music_student_profiles" DROP CONSTRAINT "music_student_profiles_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."music_student_profiles" DROP CONSTRAINT "music_student_profiles_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."music_subscriptions" DROP CONSTRAINT "music_subscriptions_discountId_fkey";

-- DropForeignKey
ALTER TABLE "public"."music_subscriptions" DROP CONSTRAINT "music_subscriptions_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."music_subscriptions" DROP CONSTRAINT "music_subscriptions_packageId_fkey";

-- DropForeignKey
ALTER TABLE "public"."music_subscriptions" DROP CONSTRAINT "music_subscriptions_studentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."music_video_lessons" DROP CONSTRAINT "music_video_lessons_courseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."music_video_lessons" DROP CONSTRAINT "music_video_lessons_organizationId_fkey";

-- DropTable
DROP TABLE "public"."music_courses";

-- DropTable
DROP TABLE "public"."music_discounts";

-- DropTable
DROP TABLE "public"."music_inquiries";

-- DropTable
DROP TABLE "public"."music_instructor_profiles";

-- DropTable
DROP TABLE "public"."music_invoices";

-- DropTable
DROP TABLE "public"."music_lesson_attendances";

-- DropTable
DROP TABLE "public"."music_lesson_sessions";

-- DropTable
DROP TABLE "public"."music_package_discounts";

-- DropTable
DROP TABLE "public"."music_packages";

-- DropTable
DROP TABLE "public"."music_payments";

-- DropTable
DROP TABLE "public"."music_student_profiles";

-- DropTable
DROP TABLE "public"."music_subscriptions";

-- DropTable
DROP TABLE "public"."music_video_lessons";

-- DropEnum
DROP TYPE "public"."AttendanceStatus";

-- DropEnum
DROP TYPE "public"."DiscountType";

-- DropEnum
DROP TYPE "public"."InquiryStatus";

-- DropEnum
DROP TYPE "public"."SessionStatus";

-- DropEnum
DROP TYPE "public"."SkillLevel";

-- DropEnum
DROP TYPE "public"."SubscriptionStatus";
