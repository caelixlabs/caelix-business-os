import { Inject, Injectable, NotFoundException } from "@nestjs/common";



import { PrismaService } from "@/common/prisma";
import { customUUID } from "@/kernel/utility/uuid";

import { MusicAttendance } from "../domain/entities/music-attendance.entity";
import type { MusicAttendanceRepository } from "../domain/repositories/music-attendance.repository";
import { MUSIC_ATTENDANCE_REPOSITORY } from "../domain/repositories/music-attendance.token";
import { MusicAttendanceStatus } from "../domain/enums/music-attendance.enum";

@Injectable()
export class MusicAttendanceService {
  constructor(
    @Inject(MUSIC_ATTENDANCE_REPOSITORY)
    private readonly repository: MusicAttendanceRepository,

    private readonly prisma: PrismaService
  ) {}

  async mark(
    organizationId: string,
    input: {
      studentId: string;
      batchId: string;
      date: string;
      status: MusicAttendanceStatus;
      notes?: string;
    }
  ) {
    const student = await this.prisma.client.musicStudent.findFirst({
      where: {
        id: input.studentId,
        organizationId,
      },
    });

    if (!student) {
      throw new NotFoundException("Student not found.");
    }

    const batch = await this.prisma.client.musicBatch.findFirst({
      where: {
        id: input.batchId,
        organizationId,
      },
    });

    if (!batch) {
      throw new NotFoundException("Batch not found.");
    }

    return this.repository.upsert(
      MusicAttendance.create({
        id: customUUID.generate(),
        organizationId,
        studentId: input.studentId,
        batchId: input.batchId,
        date: new Date(input.date),
        status: input.status,
        notes: input.notes,
      })
    );
  }

  list(organizationId: string, batchId: string, date: string) {
    return this.repository.findByBatch(organizationId, batchId, new Date(date));
  }

  listByStudent(organizationId: string, studentId: string) {
    return this.repository.findByStudent(organizationId, studentId);
  }
}
