import { Injectable } from '@nestjs/common';
import { Prisma } from '@caelix-business-os/database';

import { PrismaService } from '@/common/prisma';
import { customUUID } from '@/kernel/utility/uuid';

import {
  CreateNotificationParams,
  NotificationRecord,
  NotificationRepository,
} from '../../domain/repositories/notification.repository';

@Injectable()
export class NotificationPrismaRepository implements NotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(params: CreateNotificationParams): Promise<void> {
    await this.prisma.client.notification.create({
      data: {
        id: customUUID.generate(),
        organizationId: params.organizationId,
        userId: params.userId,
        type: params.type,
        title: params.title,
        message: params.message,
        metadata: params.metadata as Prisma.InputJsonValue ?? undefined,
      },
    });
  }

  async createMany(params: CreateNotificationParams[]): Promise<void> {
    if (params.length === 0) return;
    await this.prisma.client.notification.createMany({
      data: params.map((p) => ({
        id: customUUID.generate(),
        organizationId: p.organizationId,
        userId: p.userId,
        type: p.type,
        title: p.title,
        message: p.message,
        metadata: p.metadata as Prisma.InputJsonValue ?? undefined,
      })),
    });
  }

  async listForUser(
    userId: string,
    pagination: { skip: number; take: number },
  ): Promise<{ items: NotificationRecord[]; total: number; unreadCount: number }> {
    const [rows, total, unreadCount] = await Promise.all([
      this.prisma.client.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: pagination.skip,
        take: pagination.take,
      }),
      this.prisma.client.notification.count({ where: { userId } }),
      this.prisma.client.notification.count({ where: { userId, readAt: null } }),
    ]);

    return {
      items: rows.map(
        (row: {
          id: string;
          organizationId: string;
          userId: string;
          type: string;
          title: string;
          message: string;
          metadata: unknown;
          readAt: Date | null;
          createdAt: Date;
        }) => ({
          id: row.id,
          organizationId: row.organizationId,
          userId: row.userId,
          type: row.type,
          title: row.title,
          message: row.message,
          metadata: (row.metadata as Record<string, unknown>) ?? undefined,
          readAt: row.readAt,
          createdAt: row.createdAt,
        }),
      ),
      total,
      unreadCount,
    };
  }

  async markRead(id: string, userId: string): Promise<void> {
    await this.prisma.client.notification.updateMany({
      where: { id, userId },
      data: { readAt: new Date() },
    });
  }

  async markAllRead(userId: string): Promise<void> {
    await this.prisma.client.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });
  }
}
