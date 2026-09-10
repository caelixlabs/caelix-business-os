import { Module } from "@nestjs/common";
import { MusicStudentController } from "./students/presentation/music-student.controller";
import { MusicStudentService } from "./students/application/music-student.service";
import { MusicStudentPrismaRepository } from "./students/infrastructure/prisma/music-student.prisma.repository";
import { MusicCourseController } from "./courses/presentation/music-course.controller";
import { MusicCourseService } from "./courses/application/music-course.service";
import { MusicCoursePrismaRepository } from "./courses/infrastructure/prisma/music-course.prisma.repository";
import { MusicBatchController } from "./batches/presentation/music-batch.controller";
import { MusicBatchService } from "./batches/application/music-batch.service";
import { MusicBatchPrismaRepository } from "./batches/infrastructure/prisma/music-batch.prisma.repository";
import { MusicEnrollmentController } from "./enrollments/presentation/music-enrollment.controller";
import { MusicEnrollmentService } from "./enrollments/application/music-enrollment.service";
import { MusicEnrollmentPrismaRepository } from "./enrollments/infrastructure/prisma/music-enrollment.prisma.repository";
import { MusicAttendanceController } from "./attendance/presentation/music-attendance.controller";
import { MusicAttendanceService } from "./attendance/application/music-attendance.service";
import { MusicAttendancePrismaRepository } from "./attendance/infrastructure/prisma/music-attendance.prisma.repository";
import { MusicPracticeController } from "./practice/presentation/music-practice.controller";
import { MusicPracticeService } from "./practice/application/music-practice.service";
import { MusicPracticeLogPrismaRepository } from "./practice/infrastructure/prisma/music-practice-log.prisma.repository";
import { MUSIC_STUDENT_REPOSITORY } from "./students/domain/repositories/music-student.token";
import { MUSIC_COURSE_REPOSITORY } from "./courses/domain/repositories/music-course.token";
import { MUSIC_BATCH_REPOSITORY } from "./batches/domain/repositories/music-batch.token";
import { MUSIC_ENROLLMENT_REPOSITORY } from "./enrollments/domain/repositories/music.enrollment.token";
import { MUSIC_ATTENDANCE_REPOSITORY } from "./attendance/domain/repositories/music-attendance.token";
import { MUSIC_PRACTICE_LOG_REPOSITORY } from "./practice/domain/repositories/music-practice-log.token";

@Module({
  controllers: [
    MusicStudentController,
    MusicCourseController,
    MusicBatchController,
    MusicEnrollmentController,
    MusicAttendanceController,
    MusicPracticeController,
  ],

  providers: [
    MusicStudentService,
    MusicCourseService,
    MusicBatchService,
    MusicEnrollmentService,
    MusicAttendanceService,
    MusicPracticeService,
    MusicStudentPrismaRepository,
    MusicCoursePrismaRepository,
    MusicBatchPrismaRepository,
    MusicEnrollmentPrismaRepository,
    MusicAttendancePrismaRepository,
    MusicPracticeLogPrismaRepository,

    {
      provide: MUSIC_STUDENT_REPOSITORY,
      useExisting: MusicStudentPrismaRepository,
    },

    {
      provide: MUSIC_COURSE_REPOSITORY,
      useExisting: MusicCoursePrismaRepository,
    },

    {
      provide: MUSIC_BATCH_REPOSITORY,
      useExisting: MusicBatchPrismaRepository,
    },

    {
      provide: MUSIC_ENROLLMENT_REPOSITORY,
      useExisting: MusicEnrollmentPrismaRepository,
    },

    {
      provide: MUSIC_ATTENDANCE_REPOSITORY,
      useExisting: MusicAttendancePrismaRepository,
    },

    {
      provide: MUSIC_PRACTICE_LOG_REPOSITORY,
      useExisting: MusicPracticeLogPrismaRepository,
    },
  ],
})
export class MusicOrgModule {}
