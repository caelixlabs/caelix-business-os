import { Module } from '@nestjs/common';

import { NOTIFICATION_REPOSITORY } from './domain/repositories';
import { NotificationPrismaRepository } from './infrastructure/prisma/notification.prisma.repository';
import { NotificationController } from './presentation/controllers/notification.controller';
import { ListNotificationsHandler } from './application/list-notifications/list-notifications.handler';
import {
  MarkAllNotificationsReadHandler,
  MarkNotificationReadHandler,
} from './application/mark-read/mark-read.handler';
import { NotifyAdminsOnUserRegisteredHandler } from './application/event-handlers/notify-admins-on-user-registered.handler';
import { NotifyAdminsOnBranchCreatedHandler } from './application/event-handlers/notify-admins-on-branch-created.handler';

@Module({
  controllers: [NotificationController],
  providers: [
    ListNotificationsHandler,
    MarkNotificationReadHandler,
    MarkAllNotificationsReadHandler,
    NotifyAdminsOnUserRegisteredHandler,
    NotifyAdminsOnBranchCreatedHandler,
    {
      provide: NOTIFICATION_REPOSITORY,
      useClass: NotificationPrismaRepository,
    },
  ],
  exports: [NOTIFICATION_REPOSITORY],
})
export class NotificationModule {}