import { Module } from '@nestjs/common';

import { PrismaModule } from '@/common/prisma';

import { DOMAIN_EVENT_REPOSITORY } from './domain';

import { OutboxService } from './outbox.service';

import { PrismaDomainEventRepository } from './infrastructure';

@Module({
  imports: [PrismaModule],

  providers: [
    OutboxService,
    PrismaDomainEventRepository,
    {
      provide: DOMAIN_EVENT_REPOSITORY,
      useExisting: PrismaDomainEventRepository,
    },
  ],

  exports: [OutboxService, DOMAIN_EVENT_REPOSITORY],
})
export class OutboxModule {}
