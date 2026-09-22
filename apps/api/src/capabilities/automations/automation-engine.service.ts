import { Injectable, Logger } from "@nestjs/common";
import type { AutomationRule } from "@caelix-business-os/database";

import { PrismaService } from "@/common/prisma";
import { customUUID } from "@/kernel/utility/uuid";
import { CommunicationService } from "@/capabilities/communication/communication.service";
import { renderTemplate as render } from "@/capabilities/communication/template.util";

import { AUTOMATION_TRIGGERS } from "./automation-triggers";

type Context = Record<string, string>;
type ActionConfig = { title?: string; message?: string; subject?: string; body?: string };
type Condition = { field: string; equals: string };

const CHANNEL_BY_ACTION = {
  SEND_EMAIL_TO_CONTACT: "EMAIL",
  SEND_SMS_TO_CONTACT: "SMS",
  SEND_WHATSAPP_TO_CONTACT: "WHATSAPP",
} as const;

@Injectable()
export class AutomationEngineService {
  private readonly logger = new Logger(AutomationEngineService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly communication: CommunicationService,
  ) {}

  /** Never throws — a broken rule must not fail the business operation that raised the event. */
  async run(triggerKey: string, event: { organizationId: string }): Promise<void> {
    try {
      const rules = await this.prisma.client.automationRule.findMany({
        where: { organizationId: event.organizationId, trigger: triggerKey, enabled: true },
      });
      if (rules.length === 0) return;

      const context = await this.buildContext(triggerKey, event);

      for (const rule of rules) {
        await this.runRule(rule, context, event.organizationId);
      }
    } catch (error) {
      this.logger.error(`Automation run failed for "${triggerKey}"`, error instanceof Error ? error.stack : String(error));
    }
  }

  private async runRule(rule: AutomationRule, context: Context, organizationId: string) {
    const conditions = (rule.conditions as Condition[] | null) ?? [];
    if (!conditions.every((condition) => context[condition.field] === condition.equals)) return;

    try {
      const config = rule.actionConfig as ActionConfig;

      if (rule.actionType === "NOTIFY_ADMINS") {
        await this.notifyAdmins(organizationId, rule, render(config.title ?? rule.name, context), render(config.message ?? "", context));
      } else {
        const channel = CHANNEL_BY_ACTION[rule.actionType];
        const recipient = channel === "EMAIL" ? context.contactEmail : context.contactPhone;
        if (!context.contactId || !recipient) return;

        await this.communication.send({
          organizationId,
          channel,
          contactId: context.contactId,
          subject: channel === "EMAIL" ? (config.subject ?? rule.name) : undefined,
          body: config.body ?? "",
          source: `automation:${rule.id}`,
          variables: context,
        });
      }

      await this.prisma.client.automationRule.update({
        where: { id: rule.id },
        data: { runCount: { increment: 1 }, lastRunAt: new Date() },
      });
    } catch (error) {
      this.logger.error(`Automation rule ${rule.id} failed`, error instanceof Error ? error.stack : String(error));
    }
  }

  private async notifyAdmins(organizationId: string, rule: AutomationRule, title: string, message: string) {
    const admins = await this.prisma.client.userRole.findMany({
      where: { role: { organizationId, level: { in: ["OWNER", "ADMIN"] } } },
      select: { userId: true },
      distinct: ["userId"],
    });

    await this.prisma.client.notification.createMany({
      data: admins.map((admin) => ({
        id: customUUID.generate(),
        organizationId,
        userId: admin.userId,
        type: "automation.rule",
        title,
        message,
        metadata: { ruleId: rule.id },
      })),
    });
  }

  private async buildContext(triggerKey: string, event: object): Promise<Context> {
    const trigger = AUTOMATION_TRIGGERS.find((item) => item.key === triggerKey);
    const raw = event as Record<string, unknown>;

    const context: Context = Object.fromEntries(
      Object.entries(raw)
        .filter(([, value]) => typeof value === "string" || typeof value === "number")
        .map(([key, value]) => [key, String(value)]),
    );

    if (!trigger?.hasContact) return context;

    let contactId = raw.contactId as string | undefined;
    if (!contactId && typeof raw.enquiryId === "string") {
      const enquiry = await this.prisma.client.enquiry.findUnique({ where: { id: raw.enquiryId }, select: { contactId: true } });
      contactId = enquiry?.contactId ?? undefined;
    }

    if (contactId) {
      const contact = await this.prisma.client.contact.findUnique({ where: { id: contactId } });
      if (contact) {
        context.contactName = [contact.firstName, contact.lastName].filter(Boolean).join(" ") || contact.companyName || "";
        context.contactId = contact.id;
        context.contactEmail = contact.email ?? "";
        context.contactPhone = contact.phone ?? "";
      }
    }

    return context;
  }
}
