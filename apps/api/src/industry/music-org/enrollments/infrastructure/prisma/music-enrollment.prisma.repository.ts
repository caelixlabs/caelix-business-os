import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma';
import {
  MusicEnrollmentStatus as PrismaMusicEnrollmentStatus,
} from '@caelix-business-os/database';
import { MusicEnrollment } from '../../domain/entities/music-enrollment.entity';
import { MusicEnrollmentFilters, MusicEnrollmentRepository } from '../../domain/repositories/music-enrollment.repository';
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
    filters?: MusicEnrollmentFilters,
  ): Promise<MusicEnrollment[]> {
    const rows =
      await this.prisma.client.musicEnrollment.findMany({
        where: {
          organizationId,
          batchId: filters?.batchId,
          studentId: filters?.studentId,
        },
        orderBy: {
          enrolledAt: 'desc',
        },
      });

    return rows.map((row) => this.toDomain(row));
  }

  async findById(
    id: string,
    organizationId: string,
  ): Promise<MusicEnrollment | null> {
    const row = await this.prisma.client.musicEnrollment.findFirst({
      where: {
        id,
        organizationId,
      },
    });

    return row ? this.toDomain(row) : null;
  }

  async update(
    enrollment: MusicEnrollment,
  ): Promise<MusicEnrollment> {
    const row = await this.prisma.client.musicEnrollment.update({
      where: {
        id: enrollment.id,
      },
      data: {
        feeAmount: enrollment.feeAmount,
        discountAmount: enrollment.discountAmount,

        status:
          enrollment.status as PrismaMusicEnrollmentStatus,

        notes: enrollment.notes,
      },
    });

    return this.toDomain(row);
  }

  private toDomain(row: {
    id: string;
    organizationId: string;
    studentId: string;
    batchId: string;
    enrolledAt: Date;
    feeAmount: number;
    discountAmount: number;
    status: string;
    notes: string | null;
  }): MusicEnrollment {
    return MusicEnrollment.create({
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
    });
  }
}