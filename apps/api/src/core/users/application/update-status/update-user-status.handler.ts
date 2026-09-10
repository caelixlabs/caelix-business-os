import { Inject, Injectable } from '@nestjs/common';

import { USER_REPOSITORY } from '../../domain/repositories';
import type { UserRepository } from '../../domain/repositories';

import { EntityNotFoundException } from '@/common/framework/exceptions';

import { UserStatus } from '../../domain/enum';

import { UpdateUserStatusCommand } from './update-user-status.command';

@Injectable()
export class UpdateUserStatusHandler {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly repository: UserRepository,
  ) {}

  async execute(command: UpdateUserStatusCommand) {
    const user = await this.repository.findById(command.userId);

    if (!user || user.organizationId !== command.organizationId) {
      throw new EntityNotFoundException('User', command.userId);
    }

    switch (command.status) {
      case UserStatus.SUSPENDED:
        user.suspend();
        break;

      case UserStatus.ACTIVE:
        user.reactivate();
        break;

      default:
        throw new Error(
          `Status '${command.status}' is not supported by this operation.`,
        );
    }

    return this.repository.update(user);
  }
}