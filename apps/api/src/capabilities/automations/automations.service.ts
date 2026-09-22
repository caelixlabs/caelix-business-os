import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import type { AutomationRule } from "@caelix-business-os/database";

import { PrismaService } from "@/common/prisma";
import { customUUID } from "@/kernel/utility/uuid";

import { CreateAutomationRuleDto, UpdateAutomationRuleDto } from "./dto/automation-rule.dto";

const REQUIRED_CONFIG: Record<string, string[]> = {
  NOTIFY_ADMINS: ["title", "message"],
  SEND_EMAIL_TO_CONTACT: ["subject", "body"],
  SEND_SMS_TO_CONTACT: ["body"],
  SEND_WHATSAPP_TO_CONTACT: ["body"],
};

const toJson = (conditions?: { field: string; equals: string }[]) =>
  conditions?.map(({ field, equals }) => ({ field, equals }));

function assertConfig(actionType: string, config: Record<string, unknown>) {
  const missing = REQUIRED_CONFIG[actionType].filter((key) => typeof config[key] !== "string" || !config[key]);
  if (missing.length) throw new BadRequestException(`Action config is missing: ${missing.join(", ")}.`);
}

@Injectable()
export class AutomationsService {
  constructor(private readonly prisma: PrismaService) {}

  list(organizationId: string): Promise<AutomationRule[]> {
    return this.prisma.client.automationRule.findMany({ where: { organizationId }, orderBy: { createdAt: "desc" } });
  }

  create(organizationId: string, dto: CreateAutomationRuleDto): Promise<AutomationRule> {
    assertConfig(dto.actionType, dto.actionConfig);

    return this.prisma.client.automationRule.create({
      data: {
        id: customUUID.generate(),
        organizationId,
        name: dto.name,
        trigger: dto.trigger,
        conditions: toJson(dto.conditions),
        actionType: dto.actionType,
        actionConfig: dto.actionConfig,
        enabled: dto.enabled ?? true,
      },
    });
  }

  async update(organizationId: string, id: string, dto: UpdateAutomationRuleDto): Promise<AutomationRule> {
    const rule = await this.prisma.client.automationRule.findFirst({ where: { id, organizationId } });
    if (!rule) throw new NotFoundException("Automation rule not found.");

    if (dto.actionConfig) assertConfig(rule.actionType, dto.actionConfig);

    return this.prisma.client.automationRule.update({
      where: { id },
      data: { name: dto.name, enabled: dto.enabled, conditions: toJson(dto.conditions), actionConfig: dto.actionConfig },
    });
  }

  async remove(organizationId: string, id: string): Promise<void> {
    const { count } = await this.prisma.client.automationRule.deleteMany({ where: { id, organizationId } });
    if (count === 0) throw new NotFoundException("Automation rule not found.");
  }
}
