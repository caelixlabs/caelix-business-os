import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/common/prisma";
import { customUUID } from "@/kernel/utility/uuid";

const SETTING_KEY = "dashboard-widgets";

/**
 * Which widget keys are valid depends on the org's industry — the
 * catalog itself, not just on/off, is industry-scoped (see the
 * capability map). Add an entry here as each industry's dashboard is
 * built.
 */
const DEFAULT_WIDGETS_BY_INDUSTRY: Record<string, Record<string, boolean>> = {
  MUSIC_ORG: {
    revenue: true,
    activeStudents: true,
    presentToday: true,
    classesInSession: true,
    totalTeachers: true,
    newLeads: true,
    leadsPipeline: true,
    teachersRightNow: true,
    attendanceTrend: true,
    renewalsDue: true,
    recentActivity: true,
  },
  GYM: {
    revenue: true,
    activeMembers: true,
    presentToday: true,
    classesInSession: true,
    totalTrainers: true,
    classesLiveNow: true,
    attendanceTrend: true,
    membershipsDue: true,
    topSellers: true,
    recentActivity: true,
  },
};

@Injectable()
export class DashboardWidgetsService {
  constructor(private readonly prisma: PrismaService) {}

  async get(organizationId: string): Promise<Record<string, boolean>> {
    const organization = await this.prisma.client.organization.findUnique({
      where: { id: organizationId },
      select: { industry: true },
    });

    const defaults = DEFAULT_WIDGETS_BY_INDUSTRY[organization?.industry ?? ""] ?? {};

    const setting = await this.prisma.client.organizationSetting.findUnique({
      where: { organizationId_key: { organizationId, key: SETTING_KEY } },
    });

    const saved = (setting?.value as Record<string, boolean> | undefined) ?? {};

    // Merge onto defaults rather than trusting the saved value alone,
    // so a widget added to the catalog after an org last saved shows
    // up enabled instead of silently missing.
    return { ...defaults, ...saved };
  }

  async update(organizationId: string, widgets: Record<string, unknown>): Promise<Record<string, boolean>> {
    const sanitized: Record<string, boolean> = Object.fromEntries(
      Object.entries(widgets).filter((entry): entry is [string, boolean] => typeof entry[1] === "boolean"),
    );

    await this.prisma.client.organizationSetting.upsert({
      where: { organizationId_key: { organizationId, key: SETTING_KEY } },
      create: { id: customUUID.generate(), organizationId, key: SETTING_KEY, value: sanitized },
      update: { value: sanitized },
    });

    return this.get(organizationId);
  }
}
