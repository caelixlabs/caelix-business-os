import { UnauthorizedException } from '@nestjs/common';

import { LoginHandler } from '@/core/auth/application/login/login.handler';
import { LoginCommand } from '@/core/auth/application/login/login.command';
import { PasswordHasherService } from '@/common/security/password-hasher.service';
import { AuthSessionService } from '@/core/auth/application/services/auth-session.service';
import { User } from '@/core/users/domain/entities/user.entity';
import type { UserRepository } from '@/core/users/domain/repositories';
import { Organization } from '@/core/organization/domain/entities/organization.entity';
import type { OrganizationRepository } from '@/core/organization/domain/repositories';

describe('LoginHandler', () => {
  let userRepository: jest.Mocked<UserRepository>;
  let organizationRepository: jest.Mocked<OrganizationRepository>;
  let passwordHasher: jest.Mocked<PasswordHasherService>;
  let authSessionService: jest.Mocked<AuthSessionService>;
  let handler: LoginHandler;

  const existingOrganization = Organization.create({
    id: 'org-1',
    name: 'Acme Gym',
    slug: 'acme-gym',
  });

  const existingUser = User.register({
    id: 'user-1',
    organizationId: 'org-1',
    email: 'jane@example.com',
    passwordHash: 'hashed-password',
    firstName: 'Jane',
    lastName: 'Doe',
  });

  beforeEach(() => {
    existingUser.pullDomainEvents();
    existingOrganization.pullDomainEvents();

    userRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findByOrganization: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    organizationRepository = {
      findBySlug: jest.fn().mockResolvedValue(existingOrganization),
      existsBySlug: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<OrganizationRepository>;

    passwordHasher = {
      hash: jest.fn(),
      compare: jest.fn(),
    } as unknown as jest.Mocked<PasswordHasherService>;

    authSessionService = {
      issueSession: jest.fn(),
    } as unknown as jest.Mocked<AuthSessionService>;

    handler = new LoginHandler(
      userRepository,
      organizationRepository,
      passwordHasher,
      authSessionService,
    );
  });

  const command = new LoginCommand({
    organizationSlug: 'acme-gym',
    email: 'jane@example.com',
    password: 'correct-password',
  });

  it('throws UnauthorizedException when the organization slug does not exist', async () => {
    organizationRepository.findBySlug.mockResolvedValue(null);

    await expect(handler.execute(command)).rejects.toThrow(UnauthorizedException);
    expect(userRepository.findByEmail).not.toHaveBeenCalled();
  });

  it('throws UnauthorizedException when no user exists for the email', async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    await expect(handler.execute(command)).rejects.toThrow(UnauthorizedException);
    expect(passwordHasher.compare).not.toHaveBeenCalled();
  });

  it('throws UnauthorizedException when the password does not match', async () => {
    userRepository.findByEmail.mockResolvedValue(existingUser);
    passwordHasher.compare.mockResolvedValue(false);

    await expect(handler.execute(command)).rejects.toThrow(UnauthorizedException);
    expect(authSessionService.issueSession).not.toHaveBeenCalled();
  });

  it('never reveals whether the org, email, or password was wrong', async () => {
    organizationRepository.findBySlug.mockResolvedValue(null);
    let noOrgError: Error | undefined;
    try {
      await handler.execute(command);
    } catch (e) {
      noOrgError = e as Error;
    }

    organizationRepository.findBySlug.mockResolvedValue(existingOrganization);
    userRepository.findByEmail.mockResolvedValue(existingUser);
    passwordHasher.compare.mockResolvedValue(false);
    let wrongPasswordError: Error | undefined;
    try {
      await handler.execute(command);
    } catch (e) {
      wrongPasswordError = e as Error;
    }

    expect(noOrgError?.message).toBe(wrongPasswordError?.message);
  });

  it('rejects a suspended user even with correct credentials', async () => {
    const suspended = User.register({
      id: 'user-2',
      organizationId: 'org-1',
      email: 'suspended@example.com',
      passwordHash: 'hashed',
      firstName: 'S',
      lastName: 'U',
    });
    suspended.suspend();

    userRepository.findByEmail.mockResolvedValue(suspended);
    passwordHasher.compare.mockResolvedValue(true);

    await expect(handler.execute(command)).rejects.toThrow(UnauthorizedException);
  });

  it('records login, persists it, and issues a session on success', async () => {
    userRepository.findByEmail.mockResolvedValue(existingUser);
    passwordHasher.compare.mockResolvedValue(true);
    userRepository.update.mockImplementation(async (u) => u);
    authSessionService.issueSession.mockResolvedValue({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      tokenType: 'Bearer',
    });

    const result = await handler.execute(command);

    expect(userRepository.update).toHaveBeenCalledWith(existingUser);
    expect(existingUser.lastLoginAt).toBeInstanceOf(Date);
    expect(authSessionService.issueSession).toHaveBeenCalledWith(existingUser);
    expect(result.session.accessToken).toBe('access-token');
  });
});
