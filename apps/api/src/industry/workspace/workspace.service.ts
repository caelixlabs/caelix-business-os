// import { Injectable } from '@nestjs/common';
// import { PrismaService } from '@/common/prisma';
// import { customUUID } from '@/kernel/utility/uuid';
// import { Industry, INDUSTRY_FEATURES } from '@/industry/industry.enum';

// @Injectable()
// export class WorkspaceService {
//   constructor(private readonly prisma: PrismaService) {}

//   async get(organizationId: string) {
//     const workspace = await this.prisma.client.workspace.findUnique({ where: { organizationId } });
//     if (workspace) return workspace;
//     return this.setIndustry(organizationId, Industry.GENERAL);
//   }

//   async setIndustry(organizationId: string, industry: Industry) {
//     const features = INDUSTRY_FEATURES[industry];
//     return this.prisma.client.workspace.upsert({
//       where: { organizationId },
//       create: { id: customUUID.generate(), organizationId, industry, features },
//       update: { industry, features },
//     });
//   }
// }
