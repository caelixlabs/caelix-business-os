import { Inject, Injectable } from '@nestjs/common';

import { USER_REPOSITORY } from '@/core/users/domain/repositories';
import type { UserRepository } from '@/core/users/domain/repositories';
import { User } from '@/core/users/domain/entities/user.entity';
import { customUUID } from '@/kernel/utility/uuid';
import { ConflictException } from '@/common/framework/exceptions';

import { PasswordHasherService } from '../../../../common/security/password-hasher.service';
import { AuthSessionService } from '../services/auth-session.service';
import { RegisterCommand } from './register.command';

@Injectable()
export class RegisterHandler {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasherService,
    private readonly authSessionService: AuthSessionService,
  ) {}

  async execute(command: RegisterCommand) {
    const { dto } = command;

    const existing = await this.userRepository.findByEmail(
      dto.organizationId,
      dto.email,
    );
    if (existing) {
      throw new ConflictException(
        `A user with email '${dto.email}' already exists in this organization`,
      );
    }

    const passwordHash = await this.passwordHasher.hash(dto.password);

    const user = User.register({
      id: customUUID.generate(),
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      organizationId: dto.organizationId,
      branchId: dto.branchId,
      passwordHash,
    });

    // create() persists the user + UserRegisteredEvent atomically, then
    // publishes — by the time this resolves, RBAC's
    // AssignDefaultRoleHandler has already run, so issueSession below
    // sees the user's freshly-granted role.
    const savedUser = await this.userRepository.create(user);

    const session = await this.authSessionService.issueSession(savedUser);

    return { user: savedUser, session };
  }
}
