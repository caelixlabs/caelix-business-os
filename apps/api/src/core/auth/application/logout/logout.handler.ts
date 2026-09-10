import { Inject, Injectable } from '@nestjs/common';

import { REFRESH_TOKEN_REPOSITORY } from '../../domain/repositories';
import type { RefreshTokenRepository } from '../../domain/repositories';
import { TokenService } from '../services/token.service';
import { LogoutCommand } from './logout.command';

@Injectable()
export class LogoutHandler {
  constructor(
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(command: LogoutCommand): Promise<void> {
    const hash = this.tokenService.hashRefreshToken(command.dto.refreshToken);
    const stored = await this.refreshTokenRepository.findByHash(hash);

    // Logging out with an already-invalid token is a no-op, not an
    // error — the caller's goal (no active session) is already true.
    if (stored && !stored.revokedAt) {
      await this.refreshTokenRepository.revoke(stored.id);
    }
  }
}
