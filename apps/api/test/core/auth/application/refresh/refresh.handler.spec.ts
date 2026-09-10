import { UnauthorizedException } from '@nestjs/common';

import { RefreshHandler } from '@/core/auth/application/refresh/refresh.handler';
import { RefreshCommand } from '@/core/auth/application/refresh/refresh.command';
import { TokenService } from '@/core/auth/application/services/token.service';
import { AuthSessionService } from '@/core/auth/application/services/auth-session.service';
import { User } from '@/core/users/domain/entities/user.entity';
import type { UserRepository } from '@/core/users/domain/repositories';
import type { RefreshTokenRepository } from '@/core/auth/domain/repositories';

describe('RefreshHandler', () => {
  let refreshTokenRepository: jest.Mocked<RefreshTokenRepository>;
  let userRepository: jest.Mocked<UserRepository>;
  let tokenService: jest.Mocked<TokenService>;
  let authSessionService: jest.Mocked<AuthSessionService>;
  let handler: RefreshHandler;

  const rawToken = 'raw-refresh-token';
  const hashedToken = 'hashed-refresh-token';

  const user = User.register({
    id: 'user-1',
    organizationId: 'org-1',
    email: 'a@b.com',
    passwordHash: 'x',
    firstName: 'A',
    lastName: 'B',
  });

  beforeEach(() => {
    refreshTokenRepository = {
      create: jest.fn(),
      findByHash: jest.fn(),
      findActiveByUserId : jest.fn(),
      revoke: jest.fn(),
      revokeAllForUser: jest.fn(),
    };

    userRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findByOrganization: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    tokenService = {
      hashRefreshToken: jest.fn().mockReturnValue(hashedToken),
    } as unknown as jest.Mocked<TokenService>;

    authSessionService = {
      issueSession: jest.fn(),
    } as unknown as jest.Mocked<AuthSessionService>;

    handler = new RefreshHandler(
      refreshTokenRepository,
      userRepository,
      tokenService,
      authSessionService,
    );
  });

  const command = new RefreshCommand({ refreshToken: rawToken });

  it('throws UnauthorizedException when the token is not found', async () => {
    refreshTokenRepository.findByHash.mockResolvedValue(null);

    await expect(handler.execute(command)).rejects.toThrow(UnauthorizedException);
  });

  it('throws UnauthorizedException when the token was already revoked', async () => {
    refreshTokenRepository.findByHash.mockResolvedValue({
      id: 'rt-1',
      userId: 'user-1',
      tokenHash: hashedToken,
      expiresAt: new Date(Date.now() + 60_000),
      revokedAt: new Date(),
    });

    await expect(handler.execute(command)).rejects.toThrow(UnauthorizedException);
  });

  it('throws UnauthorizedException when the token has expired', async () => {
    refreshTokenRepository.findByHash.mockResolvedValue({
      id: 'rt-1',
      userId: 'user-1',
      tokenHash: hashedToken,
      expiresAt: new Date(Date.now() - 1),
      revokedAt: null,
    });

    await expect(handler.execute(command)).rejects.toThrow(UnauthorizedException);
  });

  it('rotates the token: revokes the old one and issues a new session', async () => {
    refreshTokenRepository.findByHash.mockResolvedValue({
      id: 'rt-1',
      userId: 'user-1',
      tokenHash: hashedToken,
      expiresAt: new Date(Date.now() + 60_000),
      revokedAt: null,
    });
    userRepository.findById.mockResolvedValue(user);
    authSessionService.issueSession.mockResolvedValue({
      accessToken: 'new-access',
      refreshToken: 'new-refresh',
      tokenType: 'Bearer',
    });

    const result = await handler.execute(command);

    expect(refreshTokenRepository.revoke).toHaveBeenCalledWith('rt-1');
    expect(authSessionService.issueSession).toHaveBeenCalledWith(user);
    expect(result.session.accessToken).toBe('new-access');
  });

  it('throws UnauthorizedException if the user behind a valid token no longer exists', async () => {
    refreshTokenRepository.findByHash.mockResolvedValue({
      id: 'rt-1',
      userId: 'deleted-user',
      tokenHash: hashedToken,
      expiresAt: new Date(Date.now() + 60_000),
      revokedAt: null,
    });
    userRepository.findById.mockResolvedValue(null);

    await expect(handler.execute(command)).rejects.toThrow(UnauthorizedException);
    expect(refreshTokenRepository.revoke).not.toHaveBeenCalled();
  });
});
