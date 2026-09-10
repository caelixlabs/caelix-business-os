// import { Injectable } from '@nestjs/common';
// import { PrismaService } from '@/common/prisma';
// import { customUUID } from '@/kernel/utility/uuid';
// import { INDUSTRY_FEATURES, Industry } from '@/industry/industry.enum';
// import { OrganizationCreatedEvent } from '@/core/organization/domain/events/organization-created.event';
// import { EventHandler, IEventHandler } from '@/common/ddd';

// @Injectable()
// @EventHandler(OrganizationCreatedEvent)
// export class CreateDefaultWorkspaceHandler implements IEventHandler<OrganizationCreatedEvent> {
//   constructor(private readonly prisma: PrismaService) {}

//   async handle(event: OrganizationCreatedEvent): Promise<void> {
//     await this.prisma.client.workspace.upsert({
//       where: { organizationId: event.organizationId },
//       create: {
//         id: customUUID.generate(),
//         organizationId: event.organizationId,
//         industry: Industry.GENERAL,
//         features: INDUSTRY_FEATURES[Industry.GENERAL],
//       },
//       update: {},
//     });
//   }
// }
