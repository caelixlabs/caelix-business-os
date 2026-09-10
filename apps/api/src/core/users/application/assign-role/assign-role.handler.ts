import { Inject, Injectable } from '@nestjs/common';

import { USER_REPOSITORY } from '../../domain/repositories';
import type { UserRepository } from '../../domain/repositories';
import { EntityNotFoundException } from '@/common/framework/exceptions';
import { RBAC_REPOSITORY } from '@/core/rbac/domain/repositories';
import type { RbacRepository } from '@/core/rbac/domain/repositories';
import { NOTIFICATION_REPOSITORY } from '@/core/notification/domain/repositories';
import type { NotificationRepository } from '@/core/notification/domain/repositories';

import { User } from '../../domain/entities/user.entity';
import { RoleSummary } from '@/core/rbac/domain';
import { AssignRoleCommand } from './assign-role.command';

@Injectable()
export class AssignRoleHandler {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(RBAC_REPOSITORY) private readonly rbacRepository: RbacRepository,
    @Inject(NOTIFICATION_REPOSITORY) private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(command: AssignRoleCommand): Promise<[User, RoleSummary | null]> {
    const user = await this.userRepository.findById(command.userId);

    if (!user || user.organizationId !== command.organizationId) {
      throw new EntityNotFoundException('User', command.userId);
    }

    await this.rbacRepository.setUserRole({
      userId: command.userId,
      organizationId: command.organizationId,
      roleId: command.roleId,
    });

    const newRole =
      await this.rbacRepository.getUserRole(command.userId);

    if (newRole) {
      await this.notificationRepository.create({
        organizationId:
          command.organizationId,
          userId: command.userId,
          type: 'role.changed',
          title: 'Your role was updated',
          message: `You are now ${newRole.name}.`,
          metadata: {roleId: newRole.id},
      });
    }
    return [user, newRole];
  }
}