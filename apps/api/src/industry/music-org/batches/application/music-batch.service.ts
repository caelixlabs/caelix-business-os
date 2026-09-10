import { Inject, Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from '@/common/prisma';
import { customUUID } from "@/kernel/utility/uuid";

import { MusicBatch } from "../domain/entities/music-batch.entity";
import type { MusicBatchRepository } from "../domain/repositories/music-batch.repository";
import { MusicBatchStatus } from "../domain/enums/music-batch-status.enum";
import { MUSIC_BATCH_REPOSITORY } from "../domain/repositories/music-batch.token";

@Injectable()
export class MusicBatchService {
  constructor(
    @Inject(MUSIC_BATCH_REPOSITORY)
    private readonly repository: MusicBatchRepository,
    private readonly prisma: PrismaService
  ) {}

  async create(
    organizationId: string,
    input: {
      branchId: string;
      courseId: string;
      teacherUserId?: string;
      name: string;
      capacity?: number;
      startDate: string;
      endDate?: string;
      days: string[];
      startTime: string;
      endTime: string;
    }
  ) {
    const branch = await this.prisma.client.branch.findFirst({
      where: {
        id: input.branchId,
        organizationId,
      },
    });

    if (!branch) {
      throw new NotFoundException("Branch not found.");
    }

    const course = await this.prisma.client.musicCourse.findFirst({
      where: {
        id: input.courseId,
        organizationId,
      },
    });

    if (!course) {
      throw new NotFoundException("Music course not found.");
    }

    if (input.teacherUserId) {
      const teacher = await this.prisma.client.user.findFirst({
        where: {
          id: input.teacherUserId,
          organizationId,
        },
      });

      if (!teacher) {
        throw new NotFoundException("Teacher not found in this organization.");
      }
    }

    return this.repository.create(
      MusicBatch.create({
        id: customUUID.generate(),
        organizationId,
        branchId: input.branchId,
        courseId: input.courseId,
        teacherUserId: input.teacherUserId,
        name: input.name,
        capacity: input.capacity ?? 20,
        startDate: new Date(input.startDate),
        endDate: input.endDate ? new Date(input.endDate) : undefined,
        days: input.days,
        startTime: input.startTime,
        endTime: input.endTime,
        status: MusicBatchStatus.PLANNED,
      })
    );
  }

  list(organizationId: string) {
    return this.repository.findByOrganization(organizationId);
  }
}
