import { Inject, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

import { USER_REPOSITORY } from '@/core/users/domain/repositories';
import type { UserRepository } from '@/core/users/domain/repositories';
import { ORGANIZATION_REPOSITORY } from '@/core/organization/domain/repositories';
import type { OrganizationRepository } from '@/core/organization/domain/repositories/organization.repository';

import { PasswordHasherService } from '@/common/security';
import { AuthSessionService } from '../services/auth-session.service';
import { LoginCommand } from './login.command';
import { UserStatus } from '@/core/users';

const INVALID_CREDENTIALS_MESSAGE = 'Invalid email or password';

@Injectable()
export class LoginHandler {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: OrganizationRepository,
    private readonly passwordHasher: PasswordHasherService,
    private readonly authSessionService: AuthSessionService,
  ) { }

  async execute(command: LoginCommand) {
    const { dto } = command;

    const organization = await this.organizationRepository.findBySlug(
      dto.organizationSlug,
    );

    if (!organization) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }
    if (!organization.industry) {
      throw new InternalServerErrorException('Organization configuration is invalid');
    }

    const user = await this.userRepository.findByEmail(
      organization.id,
      dto.email,
    );
    if (!user) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    const passwordMatches = await this.passwordHasher.compare(
      dto.password,
      user.passwordHash,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    if (
      user.status === UserStatus.SUSPENDED ||
      user.status === UserStatus.INACTIVE
    ) {
      throw new UnauthorizedException(
        `Account is ${user.status.toLowerCase()}`,
      );
    }

    user.recordLogin();
    const savedUser = await this.userRepository.update(user);
    const session = await this.authSessionService.issueSession(savedUser);

    return { user: savedUser, session };
  }
}
