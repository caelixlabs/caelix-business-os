import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/common/prisma';

import { DomainEventRepository, StoredDomainEvent } from '../domain';

import { DomainEventMapper } from './domain-event.mapper';

@Injectable()
export class PrismaDomainEventRepository implements DomainEventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(entity: StoredDomainEvent): Promise<StoredDomainEvent> {
    const model = await this.prisma.client.domainEvent.create({
      data: DomainEventMapper.toPersistence(entity),
    });

    return DomainEventMapper.toDomain(model);
  }

  async findById(id: string): Promise<StoredDomainEvent | null> {
    const model = await this.prisma.client.domainEvent.findUnique({
      where: { id },
    });

    return model ? DomainEventMapper.toDomain(model) : null;
  }

  async findAll(): Promise<StoredDomainEvent[]> {
    const rows = await this.prisma.client.domainEvent.findMany({
      orderBy: {
        occurredAt: 'desc',
      },
    });

    return rows.map(DomainEventMapper.toDomain);
  }

  async update(entity: StoredDomainEvent): Promise<StoredDomainEvent> {
    const model = await this.prisma.client.domainEvent.update({
      where: {
        id: entity.id,
      },
      data: DomainEventMapper.toPersistence(entity),
    });

    return DomainEventMapper.toDomain(model);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.client.domainEvent.delete({
      where: { id },
    });
  }

  async findUnpublished(): Promise<StoredDomainEvent[]> {
    const rows = await this.prisma.client.domainEvent.findMany({
      where: {
        publishedAt: null,
      },
      orderBy: {
        occurredAt: 'asc',
      },
    });

    return rows.map(DomainEventMapper.toDomain);
  }
}
