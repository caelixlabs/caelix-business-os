import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomBytes, createHash } from 'crypto';

export interface AccessTokenPayload {
  sub: string; // userId
  organizationId: string;
  branchId: string | null;
  roles: string[];
  permissions: string[];
}

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  signAccessToken(payload: AccessTokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>(
        'JWT_ACCESS_SECRET',
        'dev-access-secret',
      ),
      expiresIn: this.configService.get<string>(
        'JWT_ACCESS_EXPIRES_IN',
        '15m',
      ) as JwtSignOptions['expiresIn'],
    });
  }

  verifyAccessToken(token: string): AccessTokenPayload {
    return this.jwtService.verify<AccessTokenPayload>(token, {
      secret: this.configService.get<string>(
        'JWT_ACCESS_SECRET',
        'dev-access-secret',
      ),
    });
  }

  /**
   * Refresh tokens are opaque random strings, not JWTs — only their
   * SHA-256 hash is ever persisted, so a leaked database never yields a
   * usable token (mirrors how you'd store a password).
   */
  generateRefreshToken(): { token: string; hash: string } {
    const token = randomBytes(48).toString('hex');
    return { token, hash: this.hashRefreshToken(token) };
  }

  hashRefreshToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  getRefreshTokenExpiry(): Date {
    const ttl = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d');
    return new Date(Date.now() + this.parseTtlToMs(ttl));
  }

  private parseTtlToMs(ttl: string): number {
    const match = /^(\d+)([smhd])$/.exec(ttl);
    if (!match) return 7 * 24 * 60 * 60 * 1000; // default 7d

    const value = Number(match[1]);
    const unit = match[2];
    const unitMs =
      { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 }[unit] ?? 86_400_000;
    return value * unitMs;
  }
}
