import { Injectable } from '@nestjs/common';

import { Prisma } from '@caelix-business-os/database';
import { PrismaService } from '@/common/prisma';
import { customUUID } from '@/kernel/utility/uuid';

import {
  AuditLogEntry,
  AuditLogFilters,
  AuditLogRepository,
  RecordAuditEntryParams,
} from '../../domain/repositories/audit-log.repository';

@Injectable()
export class AuditLogPrismaRepository implements AuditLogRepository {
  constructor(private readonly prisma: PrismaService) { }

  async record(entry: RecordAuditEntryParams): Promise<void> {
    await this.prisma.client.auditLog.create({
      data: {
        id: customUUID.generate(),
        organizationId: entry.organizationId,
        branchId: entry.branchId ?? null,
        actorUserId: entry.actorUserId ?? null,
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId,
        metadata:
          entry.metadata !== undefined
            ? (JSON.parse(
              JSON.stringify(entry.metadata),
            ) as Prisma.InputJsonValue)
            : undefined,
      },
    });
  }

  async findByOrganization(
    organizationId: string,
    pagination: { skip: number; take: number },
    filters: AuditLogFilters = {},
  ): Promise<{ items: AuditLogEntry[]; total: number }> {
    const where: Prisma.AuditLogWhereInput = {
      organizationId,
      ...(filters.action? {action: {equals: filters.action}}: {}),
      ...(filters.entityType? {entityType: {equals: filters.entityType}}: {}),
      ...(filters.actorUserId? {actorUserId: {equals: filters.actorUserId}}: {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.client.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: pagination.skip,
        take: pagination.take,
      }),
      this.prisma.client.auditLog.count({ where }),
    ]);

    return {
      items: items.map(
        (row) => ({
          id: row.id,
          organizationId: row.organizationId,
          branchId: row.branchId ?? undefined,
          actorUserId: row.actorUserId ?? undefined,
          action: row.action,
          entityType: row.entityType,
          entityId: row.entityId,
          metadata: (row.metadata as Record<string, unknown>) ?? undefined,
          createdAt: row.createdAt,
        }),
      ),
      total,
    };
  }
}
