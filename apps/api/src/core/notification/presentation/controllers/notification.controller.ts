import { Controller, Get, Param, Patch, Query } from '@nestjs/common';

import { CurrentUser } from '@/core/auth/application/decorators';
import type { AccessTokenPayload } from '@/core/auth/application/services/token.service';

import { ListNotificationsQuery } from '../../application/list-notifications/list-notifications.query';
import { ListNotificationsHandler } from '../../application/list-notifications/list-notifications.handler';
import {
  MarkAllNotificationsReadCommand,
  MarkNotificationReadCommand,
} from '../../application/mark-read/mark-read.command';
import {
  MarkAllNotificationsReadHandler,
  MarkNotificationReadHandler,
} from '../../application/mark-read/mark-read.handler';

@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly listNotificationsHandler: ListNotificationsHandler,
    private readonly markNotificationReadHandler: MarkNotificationReadHandler,
    private readonly markAllNotificationsReadHandler: MarkAllNotificationsReadHandler,
  ) {}

  @Get()
  list(
    @CurrentUser() currentUser: AccessTokenPayload,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.listNotificationsHandler.execute(
      new ListNotificationsQuery(currentUser.sub, Number(page) || 1, Number(limit) || 20),
    );
  }

  @Patch(':id/read')
  markRead(@Param('id') id: string, @CurrentUser() currentUser: AccessTokenPayload) {
    return this.markNotificationReadHandler.execute(
      new MarkNotificationReadCommand(id, currentUser.sub),
    );
  }

  @Patch('read-all')
  markAllRead(@CurrentUser() currentUser: AccessTokenPayload) {
    return this.markAllNotificationsReadHandler.execute(
      new MarkAllNotificationsReadCommand(currentUser.sub),
    );
  }
}