import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "@/common/prisma";
import { customUUID } from "@/kernel/utility/uuid";

import { MusicEnrollment } from "../domain/entities/music-enrollment.entity";
import type { MusicEnrollmentRepository } from "../domain/repositories/music-enrollment.repository";
import { MusicEnrollmentStatus } from "../domain/enums/music-enrollment.enum";
import { MUSIC_ENROLLMENT_REPOSITORY } from "../domain/repositories/music.enrollment.token";

@Injectable()
export class MusicEnrollmentService {
  constructor(
    @Inject(MUSIC_ENROLLMENT_REPOSITORY)
    private readonly repository: MusicEnrollmentRepository,
    private readonly prisma: PrismaService
  ) {}

  async create(
    organizationId: string,
    input: {
      studentId: string;
      batchId: string;
      feeAmount?: number;
      discountAmount?: number;
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
      throw new NotFoundException("Music student not found.");
    }

    const batch = await this.prisma.client.musicBatch.findFirst({
      where: {
        id: input.batchId,
        organizationId,
      },
    });

    if (!batch) {
      throw new NotFoundException("Music batch not found.");
    }

    const existing = await this.prisma.client.musicEnrollment.findUnique({
      where: {
        studentId_batchId: {
          studentId: input.studentId,
          batchId: input.batchId,
        },
      },
    });

    if (existing) {
      throw new ConflictException("Student is already enrolled in this batch.");
    }

    const activeCount = await this.prisma.client.musicEnrollment.count({
      where: {
        batchId: input.batchId,
        status: MusicEnrollmentStatus.ACTIVE,
      },
    });

    if (activeCount >= batch.capacity) {
      throw new ConflictException("Batch capacity has been reached.");
    }

    return this.repository.create(
      MusicEnrollment.create({
        id: customUUID.generate(),
        organizationId,
        studentId: input.studentId,
        batchId: input.batchId,
        enrolledAt: new Date(),
        feeAmount: input.feeAmount ?? 0,
        discountAmount: input.discountAmount ?? 0,
        status: MusicEnrollmentStatus.ACTIVE,
        notes: input.notes,
      })
    );
  }

  list(organizationId: string) {
    return this.repository.findByOrganization(organizationId);
  }
}
