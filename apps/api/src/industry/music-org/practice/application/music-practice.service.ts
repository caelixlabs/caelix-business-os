import { Inject, Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "@/common/prisma";
import { customUUID } from "@/kernel/utility/uuid";

import { MusicPracticeLog } from "../domain/entities/music-practice-log.entity";
import type { MusicPracticeLogRepository } from "../domain/repositories/music-practice-log.repository";
import { MUSIC_PRACTICE_LOG_REPOSITORY } from "../domain/repositories/music-practice-log.token";

@Injectable()
export class MusicPracticeService {
  constructor(
    @Inject(MUSIC_PRACTICE_LOG_REPOSITORY)
    private readonly repository: MusicPracticeLogRepository,
    private readonly prisma: PrismaService
  ) {}

  async create(
    organizationId: string,
    input: {
      studentId: string;
      date?: string;
      minutes: number;
      instrument?: string;
      piece?: string;
      notes?: string;
      teacherFeedback?: string;
      rating?: number;
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

    return this.repository.create(
      MusicPracticeLog.create({
        id: customUUID.generate(),
        organizationId,
        studentId: input.studentId,
        date: input.date ? new Date(input.date) : new Date(),
        minutes: input.minutes,
        instrument: input.instrument,
        piece: input.piece,
        notes: input.notes,
        teacherFeedback: input.teacherFeedback,
        rating: input.rating,
      })
    );
  }

  list(organizationId: string, studentId: string) {
    return this.repository.findByStudent(organizationId, studentId);
  }
}
