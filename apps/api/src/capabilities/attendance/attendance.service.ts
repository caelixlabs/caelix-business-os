import { Injectable } from "@nestjs/common";
import { AttendanceStatus } from "@caelix-business-os/database";

import { PrismaService } from "@/common/prisma";
import { customUUID } from "@/kernel/utility/uuid";

export interface MarkAttendanceInput {
  contactId: string;
  context: string;
  contextId: string;
  date: Date;
  status: AttendanceStatus;
  notes?: string;
}

/**
 * One check-in record shape shared by every industry that takes
 * attendance. `context` names what kind of session this is (e.g.
 * "MUSIC_BATCH", "GYM_CLASS") and `contextId` is that session's id —
 * industries own the vocabulary, this capability just owns storage
 * and the mark/list operations against it.
 */
@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async mark(organizationId: string, input: MarkAttendanceInput) {
    return this.prisma.client.attendance.upsert({
      where: {
        contactId_context_contextId_date: {
          contactId: input.contactId,
          context: input.context,
          contextId: input.contextId,
          date: input.date,
        },
      },
      create: {
        id: customUUID.generate(),
        organizationId,
        contactId: input.contactId,
        context: input.context,
        contextId: input.contextId,
        date: input.date,
        status: input.status,
        notes: input.notes,
      },
      update: {
        status: input.status,
        notes: input.notes,
      },
    });
  }

  listByContext(organizationId: string, context: string, contextId: string, date?: Date) {
    return this.prisma.client.attendance.findMany({
      where: { organizationId, context, contextId, ...(date ? { date } : {}) },
      orderBy: { date: "desc" },
    });
  }

  listByContact(organizationId: string, contactId: string, context?: string) {
    return this.prisma.client.attendance.findMany({
      where: { organizationId, contactId, ...(context ? { context } : {}) },
      orderBy: { date: "desc" },
    });
  }

  async countPresent(organizationId: string, context: string, date: Date): Promise<{ present: number; total: number }> {
    const [present, total] = await Promise.all([
      this.prisma.client.attendance.count({ where: { organizationId, context, date, status: "PRESENT" } }),
      this.prisma.client.attendance.count({ where: { organizationId, context, date } }),
    ]);
    return { present, total };
  }

  async getTrend(organizationId: string, context: string, days: number): Promise<{ date: string; count: number }[]> {
    const today = new Date(new Date().toISOString().slice(0, 10));
    const result: { date: string; count: number }[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const count = await this.prisma.client.attendance.count({
        where: { organizationId, context, date, status: "PRESENT" },
      });
      result.push({ date: date.toISOString().slice(0, 10), count });
    }

    return result;
  }
}
