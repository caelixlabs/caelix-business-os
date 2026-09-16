-- The one existing row was backfilled into the generic Attendance
-- table (context = 'MUSIC_BATCH') before this migration ran.

-- DropForeignKey
ALTER TABLE "public"."MusicAttendance" DROP CONSTRAINT "MusicAttendance_batchId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MusicAttendance" DROP CONSTRAINT "MusicAttendance_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MusicAttendance" DROP CONSTRAINT "MusicAttendance_studentId_fkey";

-- DropTable
DROP TABLE "public"."MusicAttendance";

-- DropEnum
DROP TYPE "public"."MusicAttendanceStatus";
