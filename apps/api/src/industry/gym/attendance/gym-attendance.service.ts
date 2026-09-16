import { Injectable, NotFoundException } from "@nestjs/common";
import type { AttendanceStatus } from "@caelix-business-os/database";

import { PrismaService } from "@/common/prisma";
import { AttendanceService } from "@/capabilities/attendance/attendance.service";

const CONTEXT = "GYM_CLASS";

@Injectable()
export class GymAttendanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly attendance: AttendanceService,
  ) {}

  async mark(
    organizationId: string,
    input: { memberId: string; classId: string; date: string; status: AttendanceStatus; notes?: string },
  ) {
    const member = await this.getMemberContactId(organizationId, input.memberId);
    const gymClass = await this.prisma.client.gymClass.findFirst({
      where: { id: input.classId, organizationId },
    });

    if (!gymClass) {
      throw new NotFoundException("Class not found.");
    }

    return this.attendance.mark(organizationId, {
      contactId: member.contactId,
      context: CONTEXT,
      contextId: input.classId,
      date: new Date(input.date),
      status: input.status,
      notes: input.notes,
    });
  }

  listByClass(organizationId: string, classId: string, date: string) {
    return this.attendance.listByContext(organizationId, CONTEXT, classId, new Date(date));
  }

  async listByMember(organizationId: string, memberId: string) {
    const member = await this.getMemberContactId(organizationId, memberId);
    return this.attendance.listByContact(organizationId, member.contactId, CONTEXT);
  }

  private async getMemberContactId(organizationId: string, memberId: string) {
    const member = await this.prisma.client.gymMember.findFirst({
      where: { id: memberId, organizationId },
      select: { contactId: true },
    });

    if (!member) {
      throw new NotFoundException("Gym member not found.");
    }

    return member;
  }
}
