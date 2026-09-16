import { Injectable, NotFoundException } from "@nestjs/common";
import type { MembershipPlan, MembershipPlanStatus } from "@caelix-business-os/database";

import { PrismaService } from "@/common/prisma";
import { customUUID } from "@/kernel/utility/uuid";

export interface CreateMembershipPlanInput {
  name: string;
  description?: string;
  price: number;
  currency?: string;
  durationDays: number;
  sessionsIncluded?: number;
}

export interface UpdateMembershipPlanInput {
  name?: string;
  description?: string;
  price?: number;
  durationDays?: number;
  sessionsIncluded?: number;
  status?: MembershipPlanStatus;
}

@Injectable()
export class MembershipPlanService {
  constructor(private readonly prisma: PrismaService) {}

  create(organizationId: string, input: CreateMembershipPlanInput): Promise<MembershipPlan> {
    return this.prisma.client.membershipPlan.create({
      data: {
        id: customUUID.generate(),
        organizationId,
        name: input.name,
        description: input.description,
        price: input.price,
        currency: input.currency,
        durationDays: input.durationDays,
        sessionsIncluded: input.sessionsIncluded,
      },
    });
  }

  list(organizationId: string): Promise<MembershipPlan[]> {
    return this.prisma.client.membershipPlan.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
    });
  }

  private async findOwned(organizationId: string, id: string): Promise<MembershipPlan> {
    const plan = await this.prisma.client.membershipPlan.findFirst({ where: { id, organizationId } });

    if (!plan) {
      throw new NotFoundException("Membership plan not found.");
    }

    return plan;
  }

  async get(organizationId: string, id: string): Promise<MembershipPlan> {
    return this.findOwned(organizationId, id);
  }

  async update(organizationId: string, id: string, input: UpdateMembershipPlanInput): Promise<MembershipPlan> {
    await this.findOwned(organizationId, id);

    return this.prisma.client.membershipPlan.update({
      where: { id },
      data: {
        name: input.name,
        description: input.description,
        price: input.price,
        durationDays: input.durationDays,
        sessionsIncluded: input.sessionsIncluded,
        status: input.status,
      },
    });
  }
}
