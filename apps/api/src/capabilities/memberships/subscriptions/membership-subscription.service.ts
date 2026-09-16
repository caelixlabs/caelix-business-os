import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, type MembershipSubscriptionStatus } from "@caelix-business-os/database";

import { PrismaService } from "@/common/prisma";
import { customUUID } from "@/kernel/utility/uuid";

export interface SubscribeInput {
  contactId: string;
  planId: string;
  startsAt?: string;
  autoRenew?: boolean;
}

export interface UpdateMembershipSubscriptionInput {
  status?: MembershipSubscriptionStatus;
  sessionsRemaining?: number;
  autoRenew?: boolean;
}

const WITH_PLAN = { include: { plan: true, contact: true } } as const;

export type MembershipSubscriptionWithPlan = Prisma.MembershipSubscriptionGetPayload<typeof WITH_PLAN>;

@Injectable()
export class MembershipSubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async subscribe(organizationId: string, input: SubscribeInput): Promise<MembershipSubscriptionWithPlan> {
    const plan = await this.prisma.client.membershipPlan.findFirst({
      where: { id: input.planId, organizationId },
    });

    if (!plan) {
      throw new NotFoundException("Membership plan not found.");
    }

    const startsAt = input.startsAt ? new Date(input.startsAt) : new Date();
    const expiresAt = new Date(startsAt.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);

    return this.prisma.client.membershipSubscription.create({
      data: {
        id: customUUID.generate(),
        organizationId,
        contactId: input.contactId,
        planId: input.planId,
        sessionsRemaining: plan.sessionsIncluded,
        startsAt,
        expiresAt,
        autoRenew: input.autoRenew ?? false,
      },
      ...WITH_PLAN,
    });
  }

  list(organizationId: string, contactId?: string): Promise<MembershipSubscriptionWithPlan[]> {
    return this.prisma.client.membershipSubscription.findMany({
      where: { organizationId, ...(contactId ? { contactId } : {}) },
      orderBy: { createdAt: "desc" },
      ...WITH_PLAN,
    });
  }

  private async findOwned(organizationId: string, id: string): Promise<MembershipSubscriptionWithPlan> {
    const subscription = await this.prisma.client.membershipSubscription.findFirst({
      where: { id, organizationId },
      ...WITH_PLAN,
    });

    if (!subscription) {
      throw new NotFoundException("Membership subscription not found.");
    }

    return subscription;
  }

  async get(organizationId: string, id: string): Promise<MembershipSubscriptionWithPlan> {
    return this.findOwned(organizationId, id);
  }

  async update(
    organizationId: string,
    id: string,
    input: UpdateMembershipSubscriptionInput,
  ): Promise<MembershipSubscriptionWithPlan> {
    await this.findOwned(organizationId, id);

    return this.prisma.client.membershipSubscription.update({
      where: { id },
      data: {
        status: input.status,
        sessionsRemaining: input.sessionsRemaining,
        autoRenew: input.autoRenew,
      },
      ...WITH_PLAN,
    });
  }
}
