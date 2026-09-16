import { Injectable } from '@nestjs/common';

import { EventHandler, IEventHandler } from '@/common/ddd';
import { PrismaService } from '@/common/prisma';
import { MailService } from '@/capabilities/communication/mail/mail.service';

import { UserRegisteredEvent } from '../../domain/events';

/**
 * Fires on UserRegisteredEvent rather than OrganizationCreatedEvent —
 * organization creation doesn't yet have anyone to email; the first
 * address available is the newly registered user's own.
 */
@Injectable()
@EventHandler(UserRegisteredEvent)
export class SendWelcomeEmailHandler implements IEventHandler<UserRegisteredEvent> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
  ) {}

  async handle(event: UserRegisteredEvent): Promise<void> {
    const [user, organization] = await Promise.all([
      this.prisma.client.user.findUnique({
        where: { id: event.userId },
        select: { firstName: true },
      }),
      this.prisma.client.organization.findUnique({
        where: { id: event.organizationId },
        select: { name: true },
      }),
    ]);

    if (!user || !organization) return;

    await this.mail.sendWelcomeEmail(event.email, user.firstName, organization.name);
  }
}
