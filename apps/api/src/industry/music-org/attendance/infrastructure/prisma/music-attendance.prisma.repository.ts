import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "@/common/prisma";
import { AttendanceService } from "@/capabilities/attendance/attendance.service";
import { AttendanceStatus as PrismaAttendanceStatus } from "@caelix-business-os/database";

import { MusicAttendance } from "../../domain/entities/music-attendance.entity";
import { MusicAttendanceRepository } from "../../domain/repositories/music-attendance.repository";
import { MusicAttendanceStatus } from "../../domain/enums/music-attendance.enum";

const CONTEXT = "MUSIC_BATCH";

/**
 * Composes the generic Attendance capability rather than owning a
 * music-only table — studentId/batchId here translate to
 * contactId/context+contextId underneath. Everything above this file
 * (entity, service, DTOs, controller) is unaware of the translation.
 */
@Injectable()
export class MusicAttendancePrismaRepository implements MusicAttendanceRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly attendance: AttendanceService,
  ) {}

  async upsert(attendance: MusicAttendance): Promise<MusicAttendance> {
    const student = await this.getStudentContactId(attendance.organizationId, attendance.studentId);

    await this.attendance.mark(attendance.organizationId, {
      contactId: student.contactId,
      context: CONTEXT,
      contextId: attendance.batchId,
      date: attendance.date,
      status: attendance.status as PrismaAttendanceStatus,
      notes: attendance.notes,
    });

    return attendance;
  }

  async findByBatch(organizationId: string, batchId: string, date: Date): Promise<MusicAttendance[]> {
    const rows = await this.attendance.listByContext(organizationId, CONTEXT, batchId, date);
    const students = await this.prisma.client.musicStudent.findMany({
      where: { contactId: { in: rows.map((row) => row.contactId) } },
      select: { id: true, contactId: true },
    });
    const studentIdByContact = new Map(students.map((s) => [s.contactId, s.id]));

    return rows
      .filter((row) => studentIdByContact.has(row.contactId))
      .map((row) => this.toDomain(row, batchId, studentIdByContact.get(row.contactId) as string));
  }

  async findByStudent(organizationId: string, studentId: string): Promise<MusicAttendance[]> {
    const student = await this.getStudentContactId(organizationId, studentId);
    const rows = await this.attendance.listByContact(organizationId, student.contactId, CONTEXT);
    return rows.map((row) => this.toDomain(row, row.contextId, studentId));
  }

  private async getStudentContactId(organizationId: string, studentId: string) {
    const student = await this.prisma.client.musicStudent.findFirst({
      where: { id: studentId, organizationId },
      select: { contactId: true },
    });

    if (!student) {
      throw new NotFoundException("Student not found.");
    }

    return student;
  }

  private toDomain(
    row: { id: string; organizationId: string; date: Date; status: string; notes: string | null },
    batchId: string,
    studentId: string,
  ): MusicAttendance {
    return MusicAttendance.create({
      id: row.id,
      organizationId: row.organizationId,
      studentId,
      batchId,
      date: row.date,
      status: row.status as MusicAttendanceStatus,
      notes: row.notes ?? undefined,
    });
  }
}
