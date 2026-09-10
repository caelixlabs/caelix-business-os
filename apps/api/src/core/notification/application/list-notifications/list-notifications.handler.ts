import { Inject, Injectable } from '@nestjs/common';
import { NOTIFICATION_REPOSITORY } from '../../domain/repositories';
import type { NotificationRepository } from '../../domain/repositories';
import { ListNotificationsQuery } from './list-notifications.query';

@Injectable()
export class ListNotificationsHandler {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY) private readonly repository: NotificationRepository,
  ) {}

  async execute(query: ListNotificationsQuery) {
    const { items, total, unreadCount } = await this.repository.listForUser(query.userId, {
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });

    return {
      items,
      unreadCount,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / query.limit)),
      },
    };
  }
}