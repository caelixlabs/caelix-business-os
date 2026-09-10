import { Inject, Injectable } from '@nestjs/common';

import { EventHandler, IEventHandler } from '@/common/ddd';
import { PrismaService } from '@/common/prisma';
import { UserRegisteredEvent } from '@/core/users/domain/events';
import { NOTIFICATION_REPOSITORY } from '../../domain/repositories';
import type { NotificationRepository } from '../../domain/repositories';

/**
 * Notifies every OWNER/ADMIN in the organization when someone new
 * registers — whether via self-registration (the org's first user) or
 * an admin-issued invite. Reads recipients directly via PrismaService
 * rather than importing RBAC's repository, matching the existing
 * pattern in SeedOrganizationRolesHandler: a cross-cutting read that
 * doesn't belong to any one module's domain.
 */
@Injectable()
@EventHandler(UserRegisteredEvent)
export class NotifyAdminsOnUserRegisteredHandler implements IEventHandler<UserRegisteredEvent> {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(NOTIFICATION_REPOSITORY) private readonly notificationRepository: NotificationRepository,
  ) {}

  async handle(event: UserRegisteredEvent): Promise<void> {
    const admins = await this.prisma.client.userRole.findMany({
      where: {
        role: {
          organizationId: event.organizationId,
          level: { in: ['OWNER', 'ADMIN'] },
        },
        userId: { not: event.userId },
      },
      select: { userId: true },
      distinct: ['userId'],
    });

    if (admins.length === 0) return;

    await this.notificationRepository.createMany(
      admins.map((admin: { userId: string }) => ({
        organizationId: event.organizationId,
        userId: admin.userId,
        type: 'user.registered',
        title: 'New team member',
        message: `${event.email} joined your organization.`,
        metadata: { userId: event.userId, email: event.email },
      })),
    );
  }
}
