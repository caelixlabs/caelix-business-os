import { Injectable } from "@nestjs/common";
import { ContactType } from "@caelix-business-os/database";

import { PrismaService } from "@/common/prisma";
import { customUUID } from "@/kernel/utility/uuid";
import { MusicStudent } from "../../domain/entities/music-student.entity";
import { MusicStudentRepository } from "../../domain/repositories/music-student.repository";

const WITH_CONTACT = { include: { contact: true } } as const;

@Injectable()
export class MusicStudentPrismaRepository implements MusicStudentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(student: MusicStudent): Promise<MusicStudent> {
    const row = await this.prisma.client.$transaction(async (tx) => {
      const contact = await tx.contact.create({
        data: {
          id: customUUID.generate(),
          organizationId: student.organizationId,
          branchId: student.branchId,
          type: ContactType.PERSON,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          phone: student.phone,
        },
      });

      return tx.musicStudent.create({
        data: {
          id: student.id,
          organizationId: student.organizationId,
          branchId: student.branchId,
          contactId: contact.id,
          studentNo: student.studentNo,
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
        ...WITH_CONTACT,
      });
    });

    return this.toDomain(row);
  }

  async findById(id: string, organizationId: string) {
    const row = await this.prisma.client.musicStudent.findFirst({
      where: {
        id,
        organizationId,
      },
      ...WITH_CONTACT,
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
      ...WITH_CONTACT,
    });

    return rows.map((row) => this.toDomain(row));
  }

  async update(student: MusicStudent) {
    const row = await this.prisma.client.$transaction(async (tx) => {
      const existing = await tx.musicStudent.findUniqueOrThrow({
        where: { id: student.id },
        select: { contactId: true },
      });

      await tx.contact.update({
        where: { id: existing.contactId },
        data: {
          branchId: student.branchId,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          phone: student.phone,
        },
      });

      return tx.musicStudent.update({
        where: { id: student.id },
        data: {
          branchId: student.branchId,
          dateOfBirth: student.dateOfBirth,
          guardianName: student.guardianName,
          guardianPhone: student.guardianPhone,
          guardianEmail: student.guardianEmail,
          instrument: student.instrument,
          skillLevel: student.skillLevel,
          status: student.status,
          notes: student.notes,
        },
        ...WITH_CONTACT,
      });
    });

    return this.toDomain(row);
  }

  // biome-ignore lint: row shape carries Prisma's generated enum types,
  // which are structurally identical to but nominally distinct from the
  // hand-rolled domain enums below — pre-existing duplication, tracked
  // separately from this Contact consolidation.
  private toDomain(row: any): MusicStudent {
    return MusicStudent.create({
      id: row.id,
      organizationId: row.organizationId,
      branchId: row.branchId ?? undefined,
      studentNo: row.studentNo,
      firstName: row.contact.firstName ?? "",
      lastName: row.contact.lastName ?? "",
      email: row.contact.email ?? undefined,
      phone: row.contact.phone ?? undefined,
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
