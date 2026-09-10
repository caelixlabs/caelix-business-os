import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/common/prisma";
import { MusicStudent } from "../../domain/entities/music-student.entity";
import { MusicStudentRepository } from "../../domain/repositories/music-student.repository";

@Injectable()
export class MusicStudentPrismaRepository implements MusicStudentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(student: MusicStudent): Promise<MusicStudent> {
    const row = await this.prisma.client.musicStudent.create({
      data: {
        id: student.id,
        organizationId: student.organizationId,
        branchId: student.branchId,
        studentNo: student.studentNo,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        phone: student.phone,
        dateOfBirth: student.dateOfBirth,
        guardianName: student.guardianName,
        guardianPhone: student.guardianPhone,
        guardianEmail: student.guardianEmail,
        instrument: student.instrument,
        skillLevel: student.skillLevel,
        status: student.status,
        joinedAt: student.joinedAt,
        notes: student.notes,
      },
    });

    return this.toDomain(row);
  }

  async findById(id: string, organizationId: string) {
    const row = await this.prisma.client.musicStudent.findFirst({
      where: {
        id,
        organizationId,
      },
    });

    return row ? this.toDomain(row) : null;
  }

  async findByOrganization(organizationId: string) {
    const rows = await this.prisma.client.musicStudent.findMany({
      where: {
        organizationId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return rows.map((row) => this.toDomain(row));
  }

  async update(student: MusicStudent) {
    const row = await this.prisma.client.musicStudent.update({
      where: {
        id: student.id,
      },
      data: {
        branchId: student.branchId,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        phone: student.phone,
        dateOfBirth: student.dateOfBirth,
        guardianName: student.guardianName,
        guardianPhone: student.guardianPhone,
        guardianEmail: student.guardianEmail,
        instrument: student.instrument,
        skillLevel: student.skillLevel,
        status: student.status,
        notes: student.notes,
      },
    });

    return this.toDomain(row);
  }

  private toDomain(row: any): MusicStudent {
    return MusicStudent.create({
      id: row.id,
      organizationId: row.organizationId,
      branchId: row.branchId ?? undefined,
      studentNo: row.studentNo,
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email ?? undefined,
      phone: row.phone ?? undefined,
      dateOfBirth: row.dateOfBirth ?? undefined,
      guardianName: row.guardianName ?? undefined,
      guardianPhone: row.guardianPhone ?? undefined,
      guardianEmail: row.guardianEmail ?? undefined,
      instrument: row.instrument ?? undefined,
      skillLevel: row.skillLevel,
      status: row.status,
      joinedAt: row.joinedAt,
      notes: row.notes ?? undefined,
    });
  }
}
