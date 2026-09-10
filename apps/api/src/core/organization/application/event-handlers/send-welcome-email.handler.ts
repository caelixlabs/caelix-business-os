import { Injectable, Logger } from '@nestjs/common';

import { EventHandler, IEventHandler } from '@/common/ddd';

import { OrganizationCreatedEvent } from '../../domain/events';

@Injectable()
@EventHandler(OrganizationCreatedEvent)
export class SendWelcomeEmailHandler implements IEventHandler<OrganizationCreatedEvent> {
  private readonly logger = new Logger(SendWelcomeEmailHandler.name);

  async handle(event: OrganizationCreatedEvent): Promise<void> {
    this.logger.log(
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
