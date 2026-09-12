import { Test } from '@nestjs/testing';

import { PrismaService } from '@/common/prisma';
import { EventBus } from '@/common/ddd';

import { OrganizationPrismaRepository } from '@/core/organization/infrastructure/prisma/organization.prisma.repository';
import { Organization } from '@/core/organization/domain/entities/organization.entity';
import { OrganizationCreatedEvent } from '@/core/organization/domain/events';
import { IndustryType } from '@/core/organization/domain/enums/industry-type.enum';

jest.mock('@/common/prisma', () => ({
  PrismaService: jest.fn(),
}));

describe('OrganizationPrismaRepository Integration', () => {
  let repository: OrganizationPrismaRepository;

  const txClient = {
    organization: {
      create: jest.fn(),
    },
    domainEvent: {
      createMany: jest.fn(),
    },
  };

  const prismaMock = {
    client: {
      $transaction: jest.fn(async (work: (tx: typeof txClient) => Promise<unknown>) =>
        work(txClient),
      ),
    },
  };

  const eventBusMock = {
    publishAll: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        OrganizationPrismaRepository,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: EventBus,
          useValue: eventBusMock,
        },
      ],
    }).compile();

    repository = moduleRef.get(OrganizationPrismaRepository);
  });

  it('should persist organization and its domain event atomically, then publish', async () => {
    txClient.organization.create.mockResolvedValue({
      id: 'org-1',
      name: 'Caelix',
      slug: 'caelix',
      description: 'Business OS',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const organization = Organization.create({
      id: 'org-1',
      name: 'Caelix',
      slug: 'caelix',
      description: 'Business OS',
      industry: IndustryType.MUSIC_ORG,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await repository.create(organization);

    expect(prismaMock.client.$transaction).toHaveBeenCalledTimes(1);
    expect(txClient.organization.create).toHaveBeenCalledTimes(1);
    expect(txClient.domainEvent.createMany).toHaveBeenCalledTimes(1);

    const outboxRows = txClient.domainEvent.createMany.mock.calls[0][0].data;
    expect(outboxRows).toHaveLength(1);
    expect(outboxRows[0].eventName).toBe('OrganizationCreatedEvent');

    expect(eventBusMock.publishAll).toHaveBeenCalledTimes(1);
    const events = eventBusMock.publishAll.mock.calls[0][0];
    expect(events).toHaveLength(1);

    const event = events[0] as OrganizationCreatedEvent;
    expect(event.organizationId).toBe('org-1');
    expect(event.name).toBe('Caelix');
    expect(event.slug).toBe('caelix');

    expect(organization.pullDomainEvents()).toHaveLength(0);
    expect(result).toBeInstanceOf(Organization);
    expect(result.id).toBe('org-1');
    expect(result.slug).toBe('caelix');
  });
});
