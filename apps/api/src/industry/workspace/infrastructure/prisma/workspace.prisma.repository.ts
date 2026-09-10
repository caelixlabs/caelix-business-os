// import { Injectable } from '@nestjs/common';

// import { PrismaService } from '@/common/prisma';
// import { customUUID } from '@/kernel/utility/uuid';

// import {
//   WorkspaceRecord,
//   WorkspaceRepository,
// } from '../../domain/repositories/workspace.repository';
// import { Industry } from '@/industry/industry.enum';

// @Injectable()
// export class WorkspacePrismaRepository implements WorkspaceRepository {
//   constructor(private readonly prisma: PrismaService) {}

//   async findByOrganization(organizationId: string): Promise<WorkspaceRecord | null> {
//     const row = await this.prisma.client.workspace.findUnique({
//       where: { organizationId },
//     });

//     if (!row) return null;

//     return {
//       id: row.id,
//       organizationId: row.organizationId,
//       industry: row.industry as Industry,
//       features: row.features as string[],
//     };
//   }

//   async upsert(organizationId: string, industry: Industry, features: string[]): Promise<WorkspaceRecord> {
//     const row = await this.prisma.client.workspace.upsert({
//       where: { organizationId },
//       create: {
//         id: customUUID.generate(),
//         organizationId,
//         industry,
//         features,
//       },
//       update: { industry, features },
//     });

//     return {
//       id: row.id,
//       organizationId: row.organizationId,
//       industry: row.industry as Industry,
//       features: row.features as string[],
//     };
//   }
// }