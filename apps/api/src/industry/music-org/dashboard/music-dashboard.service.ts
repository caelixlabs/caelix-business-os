import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/common/prisma";
import { AttendanceService } from "@/capabilities/attendance/attendance.service";

const WEEKDAY_ABBR = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const ATTENDANCE_CONTEXT = "MUSIC_BATCH";

function startOfDay(date: Date): Date {
  return new Date(date.toISOString().slice(0, 10));
}

function todayAbbreviation(): string {
  return WEEKDAY_ABBR[new Date().getDay()];
}

function currentTimeHHMM(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function minutesUntil(endTime: string): number {
  const [h, m] = endTime.split(":").map(Number);
  const now = new Date();
  const end = new Date(now);
  end.setHours(h, m, 0, 0);
  return Math.max(0, Math.round((end.getTime() - now.getTime()) / 60000));
}

@Injectable()
export class MusicDashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly attendance: AttendanceService,
  ) {}

  async getOverview(organizationId: string) {
    const now = new Date();
    const today = startOfDay(now);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const sevenDaysAgo = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
    const sevenDaysAhead = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const weekday = todayAbbreviation();
    const nowTime = currentTimeHHMM();

    const [
      revenueAgg,
      activeStudents,
      presentToday,
      liveBatches,
      teacherIds,
      newLeads,
      convertedLeads,
      leadsByStatus,
      attendanceLast7Days,
      renewalsDue,
      recentAuditLogs,
    ] = await Promise.all([
      this.prisma.client.payment.aggregate({
        where: { organizationId, paidAt: { gte: monthStart } },
        _sum: { amount: true },
      }),
      this.prisma.client.musicStudent.count({ where: { organizationId, status: "ACTIVE" } }),
      this.attendance.countPresent(organizationId, ATTENDANCE_CONTEXT, today),
      this.prisma.client.musicBatch.findMany({
        where: {
          organizationId,
          status: "ACTIVE",
          days: { has: weekday },
          startTime: { lte: nowTime },
          endTime: { gte: nowTime },
        },
        include: { teacher: true },
      }),
      this.prisma.client.musicBatch.findMany({
        where: { organizationId, teacherUserId: { not: null } },
        select: { teacherUserId: true },
        distinct: ["teacherUserId"],
      }),
      this.prisma.client.enquiry.count({ where: { organizationId, createdAt: { gte: sevenDaysAgo } } }),
      this.prisma.client.enquiry.count({
        where: { organizationId, status: "CONVERTED", createdAt: { gte: sevenDaysAgo } },
      }),
      this.prisma.client.enquiry.groupBy({
        by: ["status"],
        where: { organizationId, createdAt: { gte: sevenDaysAgo } },
        _count: { _all: true },
      }),
      this.attendance.getTrend(organizationId, ATTENDANCE_CONTEXT, 7),
      this.prisma.client.membershipSubscription.findMany({
        where: {
          organizationId,
          status: "ACTIVE",
          expiresAt: { gte: today, lte: sevenDaysAhead },
        },
        include: { contact: true, plan: true },
        orderBy: { expiresAt: "asc" },
        take: 10,
      }),
      this.prisma.client.auditLog.findMany({
        where: { organizationId },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
    ]);

    return {
      revenueMtd: Number(revenueAgg._sum.amount ?? 0),
      activeStudents,
      presentToday,
      classesInSession: liveBatches.map((batch) => ({
        id: batch.id,
        name: batch.name,
        teacherName: batch.teacher ? `${batch.teacher.firstName} ${batch.teacher.lastName}` : null,
        minutesLeft: minutesUntil(batch.endTime),
      })),
      totalTeachers: teacherIds.length,
      leads: {
        total: newLeads,
        converted: convertedLeads,
        byStatus: Object.fromEntries(leadsByStatus.map((row) => [row.status, row._count._all])),
      },
      attendanceTrend: attendanceLast7Days,
      renewalsDue: renewalsDue.map((sub) => ({
        id: sub.id,
        contactName: `${sub.contact.firstName ?? ""} ${sub.contact.lastName ?? ""}`.trim(),
        planName: sub.plan.name,
        expiresAt: sub.expiresAt,
        amount: Number(sub.plan.price),
      })),
      recentActivity: recentAuditLogs.map((log) => ({
        id: log.id,
        action: log.action,
        entityType: log.entityType,
        createdAt: log.createdAt,
      })),
    };
  }
}
