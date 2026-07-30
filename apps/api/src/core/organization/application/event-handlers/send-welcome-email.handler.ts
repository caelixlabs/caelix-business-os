import { Injectable } from '@nestjs/common';

import {
  EventHandler,
  IEventHandler
} from '@/common/ddd';

import { OrganizationCreatedEvent } from '../../domain/events';

@Injectable()
@EventHandler(OrganizationCreatedEvent)
export class SendWelcomeEmailHandler
  implements IEventHandler<OrganizationCreatedEvent>
{
  async handle(
    event: OrganizationCreatedEvent,
  ): Promise<void> {
    console.log(
      `Sending welcome email for organization ${event.organizationId}`,
    );

    // Future:
    // await emailService.sendWelcomeEmail(...)
  }
}

//to do

// CreateDefaultAdminHandler

// AuditLogHandler

// BillingSubscriptionHandler

// AnalyticsHandler