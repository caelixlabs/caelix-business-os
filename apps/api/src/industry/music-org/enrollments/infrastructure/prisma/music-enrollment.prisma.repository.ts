import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma';
import {
  MusicEnrollmentStatus as PrismaMusicEnrollmentStatus,
} from '@caelix-business-os/database';
import { MusicEnrollment } from '../../domain/entities/music-enrollment.entity';
import { MusicEnrollmentRepository } from '../../domain/repositories/music-enrollment.repository';
import { MusicEnrollmentStatus } from '../../domain/enums/music-enrollment.enum';

@Injectable()
export class MusicEnrollmentPrismaRepository implements MusicEnrollmentRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async create(
    enrollment: MusicEnrollment,
  ): Promise<MusicEnrollment> {
    await this.prisma.client.musicEnrollment.create({
      data: {
        id: enrollment.id,
        organizationId: enrollment.organizationId,
        studentId: enrollment.studentId,
        batchId: enrollment.batchId,
        enrolledAt: enrollment.enrolledAt,
        feeAmount: enrollment.feeAmount,
        discountAmount: enrollment.discountAmount,

        status:
          enrollment.status as PrismaMusicEnrollmentStatus,

        notes: enrollment.notes,
      },
    });

    return enrollment;
  }

  async findByOrganization(
    organizationId: string,
  ): Promise<MusicEnrollment[]> {
    const rows =
      await this.prisma.client.musicEnrollment.findMany({
        where: {
          organizationId,
        },
        orderBy: {
          enrolledAt: 'desc',
        },
      });

    return rows.map(
      (row) =>
        MusicEnrollment.create({
          id: row.id,
          organizationId: row.organizationId,
          studentId: row.studentId,
          batchId: row.batchId,
          enrolledAt: row.enrolledAt,
          feeAmount: row.feeAmount,
          discountAmount: row.discountAmount,

          status:
            row.status as MusicEnrollmentStatus,

          notes: row.notes ?? undefined,
        }),
    );
  }
}