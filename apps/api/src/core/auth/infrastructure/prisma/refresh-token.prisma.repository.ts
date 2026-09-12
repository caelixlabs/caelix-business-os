import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/common/prisma';

import {
  RefreshTokenRepository,
  StoredRefreshToken,
} from '../../domain/repositories/refresh-token.repository';

@Injectable()
export class RefreshTokenPrismaRepository implements RefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(params: {
    id: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<void> {
    await this.prisma.client.refreshToken.create({ data: params });
  }
  async findActiveByUserId(userId: string): Promise<StoredRefreshToken | null> {
    return this.prisma.client.refreshToken.findFirst({
      where: {
        userId,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByHash(tokenHash: string): Promise<StoredRefreshToken | null> {
    return this.prisma.client.refreshToken.findUnique({ where: { tokenHash } });
  }

  async revoke(id: string): Promise<void> {
    await this.prisma.client.refreshToken.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAllByUserId(userId: string): Promise<void> {
    await this.prisma.client.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
