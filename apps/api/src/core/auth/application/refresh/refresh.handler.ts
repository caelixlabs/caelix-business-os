import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import { USER_REPOSITORY } from '@/core/users/domain/repositories';
import type { UserRepository } from '@/core/users/domain/repositories';

import { REFRESH_TOKEN_REPOSITORY } from '../../domain/repositories';
import type { RefreshTokenRepository } from '../../domain/repositories';
import { TokenService } from '../services/token.service';
import { AuthSessionService } from '../services/auth-session.service';
import { RefreshCommand } from './refresh.command';

const INVALID_REFRESH_TOKEN_MESSAGE = 'Invalid or expired refresh token';

@Injectable()
export class RefreshHandler {
  constructor(
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: RefreshTokenRepository,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
    private readonly authSessionService: AuthSessionService,
  ) {}

  async execute(command: RefreshCommand) {
    const hash = this.tokenService.hashRefreshToken(command.dto.refreshToken);
    const stored = await this.refreshTokenRepository.findByHash(hash);

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new UnauthorizedException(INVALID_REFRESH_TOKEN_MESSAGE);
    }

    const user = await this.userRepository.findById(stored.userId);
    if (!user) {
      throw new UnauthorizedException(INVALID_REFRESH_TOKEN_MESSAGE);
    }

    // Rotate: the presented refresh token is single-use. Revoking it
    // here means a stolen-and-replayed refresh token stops working the
    // instant the legitimate client rotates past it.
    await this.refreshTokenRepository.revoke(stored.id);

    const session = await this.authSessionService.issueSession(user);

    return { user, session };
  }
}
