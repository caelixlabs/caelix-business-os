import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/prisma";

import { MusicBatch } from "../../domain/entities/music-batch.entity";
import { MusicBatchRepository } from "../../domain/repositories/music-batch.repository";

@Injectable()
export class MusicBatchPrismaRepository implements MusicBatchRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(batch: MusicBatch) {
    const row = await this.prisma.client.musicBatch.create({
      data: {
        id: batch.id,
        organizationId: batch.organizationId,
        branchId: batch.branchId,
        courseId: batch.courseId,
        teacherUserId: batch.teacherUserId,
        name: batch.name,
        capacity: batch.capacity,
        startDate: batch.startDate,
        endDate: batch.endDate,
        days: batch.days,
        startTime: batch.startTime,
        endTime: batch.endTime,
        status: batch.status,
      },
    });

    return this.toDomain(row);
  }

  async findByOrganization(organizationId: string) {
    const rows = await this.prisma.client.musicBatch.findMany({
      where: { organizationId },
      orderBy: {
        startDate: "asc",
      },
    });

    return rows.map((row) => this.toDomain(row));
  }

  async findById(id: string, organizationId: string) {
    const row = await this.prisma.client.musicBatch.findFirst({
      where: {
        id,
        organizationId,
      },
    });

    return row ? this.toDomain(row) : null;
  }

  private toDomain(row: any) {
    return MusicBatch.create({
      id: row.id,
      organizationId: row.organizationId,
      branchId: row.branchId,
      courseId: row.courseId,
      teacherUserId: row.teacherUserId ?? undefined,
      name: row.name,
      capacity: row.capacity,
      startDate: row.startDate,
      endDate: row.endDate ?? undefined,
      days: row.days,
      startTime: row.startTime,
      endTime: row.endTime,
      status: row.status,
    });
  }
}
