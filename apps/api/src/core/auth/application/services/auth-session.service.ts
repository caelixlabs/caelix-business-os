import { Inject, Injectable } from '@nestjs/common';

import { User } from '@/core/users/domain/entities/user.entity';
import { RBAC_REPOSITORY } from '@/core/rbac/domain/repositories';
import type { RbacRepository } from '@/core/rbac/domain/repositories';
import { customUUID } from '@/kernel/utility/uuid';

import { REFRESH_TOKEN_REPOSITORY } from '../../domain/repositories';
import type { RefreshTokenRepository } from '../../domain/repositories';
import { TokenService } from './token.service';
import { ConflictException } from '@/common/framework/exceptions';

export interface Session {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  roles: string[];
  permissions: string[];
}

/**
 * Shared by both RegisterHandler and LoginHandler so "how we turn a
 * User into a token pair" is written exactly once. Reads the user's
 * current effective permissions from RBAC and embeds them directly in
 * the access token, so authorization on every subsequent request is a
 * pure JWT check — no DB round trip per request.
 */
@Injectable()
export class AuthSessionService {
  constructor(
    @Inject(RBAC_REPOSITORY)
    private readonly rbacRepository: RbacRepository,

    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: RefreshTokenRepository,

    private readonly tokenService: TokenService,
  ) { }

  async issueSession(user: User,
    options: {
      replaceExistingSession?: boolean;
    } = {}): Promise<Session> {
    const existing = await this.refreshTokenRepository.findActiveByUserId(user.id);

    if (existing && !options.replaceExistingSession) {
      throw new ConflictException('User is already logged in.');
    }

    if (existing && options.replaceExistingSession) {
      await this.refreshTokenRepository.revokeAllByUserId(user.id);
    }
    const access = await this.rbacRepository.getEffectiveAccess(user.id);

    const accessToken = this.tokenService.signAccessToken({
      sub: user.id,
      organizationId: user.organizationId,
      branchId: user.branchId ?? null,
      roles: access.roles,
      permissions: access.permissions,
    });

    const { token: refreshToken, hash } =
      this.tokenService.generateRefreshToken();

    await this.refreshTokenRepository.create({
      id: customUUID.generate(),
      userId: user.id,
      tokenHash: hash,
      expiresAt: this.tokenService.getRefreshTokenExpiry(),
    });

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      roles: access.roles,
      permissions: access.permissions,
    };
  }
}
