import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/prisma";

import { MusicCourse } from "../../domain/entities/music-course.entity";
import { MusicCourseRepository } from "../../domain/repositories/music-course.repository";

@Injectable()
export class MusicCoursePrismaRepository implements MusicCourseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(course: MusicCourse) {
    const row = await this.prisma.client.musicCourse.create({
      data: {
        id: course.id,
        organizationId: course.organizationId,
        code: course.code,
        name: course.name,
        description: course.description,
        instrument: course.instrument,
        skillLevel: course.skillLevel,
        durationWeeks: course.durationWeeks,
        classDurationMinutes: course.classDurationMinutes,
        status: course.status,
      },
    });

    return this.toDomain(row);
  }

  async findByOrganization(organizationId: string) {
    const rows = await this.prisma.client.musicCourse.findMany({
      where: { organizationId },
      orderBy: { name: "asc" },
    });

    return rows.map((row) => this.toDomain(row));
  }

  async findById(id: string, organizationId: string) {
    const row = await this.prisma.client.musicCourse.findFirst({
      where: {
        id,
        organizationId,
      },
    });

    return row ? this.toDomain(row) : null;
  }

  async update(course: MusicCourse) {
    const row = await this.prisma.client.musicCourse.update({
      where: {
        id: course.id,
      },
      data: {
        name: course.name,
        description: course.description,
        instrument: course.instrument,
        skillLevel: course.skillLevel,
        durationWeeks: course.durationWeeks,
        classDurationMinutes: course.classDurationMinutes,
        status: course.status,
      },
    });

    return this.toDomain(row);
  }

  private toDomain(row: any) {
    return MusicCourse.create({
      id: row.id,
      organizationId: row.organizationId,
      code: row.code,
      name: row.name,
      description: row.description ?? undefined,
      instrument: row.instrument ?? undefined,
      skillLevel: row.skillLevel,
      durationWeeks: row.durationWeeks ?? undefined,
      classDurationMinutes: row.classDurationMinutes,
      status: row.status,
    });
  }
}
