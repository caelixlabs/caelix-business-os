import { Inject, Injectable } from '@nestjs/common';

import { EventHandler, IEventHandler } from '@/common/ddd';
import { PrismaService } from '@/common/prisma';
import { BranchCreatedEvent } from '@/core/branch/domain/events';
import { NOTIFICATION_REPOSITORY } from '../../domain/repositories';
import type { NotificationRepository } from '../../domain/repositories';

@Injectable()
@EventHandler(BranchCreatedEvent)
export class NotifyAdminsOnBranchCreatedHandler implements IEventHandler<BranchCreatedEvent> {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(NOTIFICATION_REPOSITORY) private readonly notificationRepository: NotificationRepository,
  ) {}

  async handle(event: BranchCreatedEvent): Promise<void> {
    const admins = await this.prisma.client.userRole.findMany({
      where: {
        role: {
          organizationId: event.organizationId,
          level: { in: ['OWNER', 'ADMIN'] },
        },
      },
      select: { userId: true },
      distinct: ['userId'],
    });

    // No-op for the auto-created PRIMARY branch: it's created before
    // the organization has any users at all, so there's no one to
    // notify yet — this simply finds zero admins and returns.
    if (admins.length === 0) return;

    await this.notificationRepository.createMany(
      admins.map((admin: { userId: string }) => ({
        organizationId: event.organizationId,
        userId: admin.userId,
        type: 'branch.created',
        title: 'New branch created',
        message: `"${event.name}" was added to your organization.`,
        metadata: { branchId: event.branchId },
      })),
    );
  }
}