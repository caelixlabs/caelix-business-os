import { Inject, Injectable } from '@nestjs/common';

import { USER_REPOSITORY } from '../../domain/repositories';
import type { UserRepository } from '../../domain/repositories';
import { User } from '../../domain/entities/user.entity';
import { customUUID } from '@/kernel/utility/uuid';
import { ConflictException } from '@/common/framework/exceptions';
import { PasswordHasherService } from '@/common/security/password-hasher.service';
import { InviteUserCommand } from './invite-user.command';

/**
 * Admin-initiated user creation ("invite"), distinct from
 * self-registration (RegisterHandler in the auth module — used only
 * for the very first user of a new organization). The invited user
 * gets EMPLOYEE by default via AssignDefaultRoleHandler reacting to
 * UserRegisteredEvent (they are never the organization's first user,
 * so the OWNER branch of that handler never applies here) — an OWNER
 * or ADMIN can then promote them via AssignRoleHandler.
 *
 * There is no email delivery in this phase: the caller sets the
 * user's initial password directly and is expected to share it
 * out-of-band. Swapping this for a real invite-token + email flow is
 * a drop-in replacement for this handler alone.
 */
@Injectable()
export class InviteUserHandler {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasherService,
  ) {}

  async execute(command: InviteUserCommand) {
    const { organizationId, dto } = command;

    const existing = await this.userRepository.findByEmail(organizationId, dto.email);
    if (existing) {
      throw new ConflictException(
        `A user with email '${dto.email}' already exists in this organization`,
      );
    }

    const passwordHash = await this.passwordHasher.hash(dto.temporaryPassword);

    const user = User.register({
      id: customUUID.generate(),
      organizationId,
      branchId: dto.branchId,
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
    });

    return this.userRepository.create(user);
  }
}
