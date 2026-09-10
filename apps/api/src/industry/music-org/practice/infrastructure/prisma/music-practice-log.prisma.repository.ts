import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/common/prisma';

import { MusicPracticeLog } from '../../domain/entities/music-practice-log.entity';
import { MusicPracticeLogRepository } from '../../domain/repositories/music-practice-log.repository';

@Injectable()
export class MusicPracticeLogPrismaRepository
  implements MusicPracticeLogRepository
{
  constructor(    
    private readonly prisma: PrismaService,
  ) {}

  async create(
    log: MusicPracticeLog,
  ): Promise<MusicPracticeLog> {
    await this.prisma.client.musicPracticeLog.create({
      data: {
        id: log.id,
        organizationId: log.organizationId,
        studentId: log.studentId,
        date: log.date,
        minutes: log.minutes,
        instrument: log.instrument,
        piece: log.piece,
        notes: log.notes,
        teacherFeedback: log.teacherFeedback,
        rating: log.rating,
      },
    });

    return log;
  }

  async findByStudent(
    organizationId: string,
    studentId: string,
  ): Promise<MusicPracticeLog[]> {
    const rows =
      await this.prisma.client.musicPracticeLog.findMany({
        where: {
          organizationId,
          studentId,
        },
        orderBy: {
          date: 'desc',
        },
      });

    return rows.map((row) =>
      MusicPracticeLog.create({
        id: row.id,
        organizationId: row.organizationId,
        studentId: row.studentId,
        date: row.date,
        minutes: row.minutes,
        instrument:
          row.instrument ?? undefined,
        piece:
          row.piece ?? undefined,
        notes:
          row.notes ?? undefined,
        teacherFeedback:
          row.teacherFeedback ?? undefined,
        rating:
          row.rating ?? undefined,
      }),
    );
  }
}