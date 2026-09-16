import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/common/prisma";
import { AttendanceService } from "@/capabilities/attendance/attendance.service";

const WEEKDAY_ABBR = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const ATTENDANCE_CONTEXT = "GYM_CLASS";
const SAFE_USER_SELECT = { select: { id: true, firstName: true, lastName: true } } as const;

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
export class GymDashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly attendance: AttendanceService,
  ) {}

  async getOverview(organizationId: string) {
    const now = new Date();
    const today = startOfDay(now);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const sevenDaysAhead = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const weekday = todayAbbreviation();
    const nowTime = currentTimeHHMM();

    const [
      paymentAgg,
      salesAgg,
      activeMembers,
      presentToday,
      liveClasses,
      trainerIds,
      attendanceLast7Days,
      membershipsDue,
      topSellerLines,
      recentAuditLogs,
    ] = await Promise.all([
      this.prisma.client.payment.aggregate({
        where: { organizationId, paidAt: { gte: monthStart } },
        _sum: { amount: true },
      }),
      this.prisma.client.sale.aggregate({
        where: { organizationId, status: "COMPLETED", createdAt: { gte: monthStart } },
        _sum: { totalAmount: true },
      }),
      this.prisma.client.gymMember.count({ where: { organizationId, status: "ACTIVE" } }),
      this.attendance.countPresent(organizationId, ATTENDANCE_CONTEXT, today),
      this.prisma.client.gymClass.findMany({
        where: {
          organizationId,
          status: "ACTIVE",
          days: { has: weekday },
          startTime: { lte: nowTime },
          endTime: { gte: nowTime },
        },
        include: { trainer: SAFE_USER_SELECT },
      }),
      this.prisma.client.gymClass.findMany({
        where: { organizationId, trainerUserId: { not: null } },
        select: { trainerUserId: true },
        distinct: ["trainerUserId"],
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
      this.prisma.client.saleLine.groupBy({
        by: ["staffUserId"],
        where: {
          staffUserId: { not: null },
          sale: { organizationId, status: "COMPLETED", createdAt: { gte: monthStart } },
        },
        _sum: { lineTotal: true },
        orderBy: { _sum: { lineTotal: "desc" } },
        take: 5,
      }),
      this.prisma.client.auditLog.findMany({
        where: { organizationId },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
    ]);

    const sellerIds = topSellerLines.map((row) => row.staffUserId).filter((id): id is string => Boolean(id));
    const sellers = sellerIds.length
      ? await this.prisma.client.user.findMany({ where: { id: { in: sellerIds } }, select: { id: true, firstName: true, lastName: true } })
      : [];
    const sellerById = new Map(sellers.map((seller) => [seller.id, seller]));

    return {
      revenueMtd: Number(paymentAgg._sum.amount ?? 0) + Number(salesAgg._sum.totalAmount ?? 0),
      activeMembers,
      presentToday,
      classesInSession: liveClasses.map((gymClass) => ({
        id: gymClass.id,
        name: gymClass.name,
        trainerName: gymClass.trainer ? `${gymClass.trainer.firstName} ${gymClass.trainer.lastName}` : null,
        minutesLeft: minutesUntil(gymClass.endTime),
      })),
      totalTrainers: trainerIds.length,
      attendanceTrend: attendanceLast7Days,
      membershipsDue: membershipsDue.map((sub) => ({
        id: sub.id,
        contactName: `${sub.contact.firstName ?? ""} ${sub.contact.lastName ?? ""}`.trim(),
        planName: sub.plan.name,
        expiresAt: sub.expiresAt,
        amount: Number(sub.plan.price),
      })),
      topSellers: topSellerLines
        .filter((row) => row.staffUserId && sellerById.has(row.staffUserId))
        .map((row) => {
          const seller = sellerById.get(row.staffUserId as string)!;
          return {
            userId: seller.id,
            name: `${seller.firstName} ${seller.lastName}`,
            totalSales: Number(row._sum.lineTotal ?? 0),
          };
        }),
      recentActivity: recentAuditLogs.map((log) => ({
        id: log.id,
        action: log.action,
        entityType: log.entityType,
        createdAt: log.createdAt,
      })),
    };
  }
}
