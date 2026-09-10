import { RegisterHandler } from '@/core/auth/application/register/register.handler';
import { RegisterCommand } from '@/core/auth/application/register/register.command';
import { PasswordHasherService } from '@/common/security/password-hasher.service';
import { AuthSessionService } from '@/core/auth/application/services/auth-session.service';
import { User } from '@/core/users/domain/entities/user.entity';
import type { UserRepository } from '@/core/users/domain/repositories';
import { ConflictException } from '@/common/framework/exceptions';

describe('RegisterHandler', () => {
  let userRepository: jest.Mocked<UserRepository>;
  let passwordHasher: jest.Mocked<PasswordHasherService>;
  let authSessionService: jest.Mocked<AuthSessionService>;
  let handler: RegisterHandler;

  const dto = {
    organizationId: 'org-1',
    email: 'new@example.com',
    password: 'super-secret-1',
    firstName: 'New',
    lastName: 'User',
  };

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findByOrganization: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    passwordHasher = {
      hash: jest.fn(),
      compare: jest.fn(),
    } as unknown as jest.Mocked<PasswordHasherService>;

    authSessionService = {
      issueSession: jest.fn(),
    } as unknown as jest.Mocked<AuthSessionService>;

    handler = new RegisterHandler(userRepository, passwordHasher, authSessionService);
  });

  it('throws ConflictException when the email is already taken in the organization', async () => {
    userRepository.findByEmail.mockResolvedValue(
      User.register({
        id: 'existing',
        organizationId: 'org-1',
        email: dto.email,
        passwordHash: 'x',
        firstName: 'X',
        lastName: 'Y',
      }),
    );

    await expect(handler.execute(new RegisterCommand(dto))).rejects.toThrow(ConflictException);
    expect(userRepository.create).not.toHaveBeenCalled();
  });

  it('hashes the password before persisting — never stores it plain', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    passwordHasher.hash.mockResolvedValue('bcrypt-hash');
    userRepository.create.mockImplementation(async (u) => u);
    authSessionService.issueSession.mockResolvedValue({
      accessToken: 'a',
      refreshToken: 'r',
      tokenType: 'Bearer',
    });

    await handler.execute(new RegisterCommand(dto));

    expect(passwordHasher.hash).toHaveBeenCalledWith(dto.password);
    const createdUser = userRepository.create.mock.calls[0][0];
    expect(createdUser.passwordHash).toBe('bcrypt-hash');
  });

  it('creates the user, then issues a session for it', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    passwordHasher.hash.mockResolvedValue('bcrypt-hash');
    userRepository.create.mockImplementation(async (u) => u);
    authSessionService.issueSession.mockResolvedValue({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      tokenType: 'Bearer',
    });

    const result = await handler.execute(new RegisterCommand(dto));

    expect(result.user.email).toBe(dto.email);
    expect(authSessionService.issueSession).toHaveBeenCalledWith(result.user);
    expect(result.session.accessToken).toBe('access-token');
  });
});
