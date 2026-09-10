import { Inject, Injectable } from '@nestjs/common';
import { NOTIFICATION_REPOSITORY } from '../../domain/repositories';
import type { NotificationRepository } from '../../domain/repositories';
import { MarkAllNotificationsReadCommand, MarkNotificationReadCommand } from './mark-read.command';

@Injectable()
export class MarkNotificationReadHandler {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY) private readonly repository: NotificationRepository,
  ) {}

  execute(command: MarkNotificationReadCommand) {
    return this.repository.markRead(command.id, command.userId);
  }
}

@Injectable()
export class MarkAllNotificationsReadHandler {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY) private readonly repository: NotificationRepository,
  ) {}

  execute(command: MarkAllNotificationsReadCommand) {
    return this.repository.markAllRead(command.userId);
  }
}