import { Test } from '@nestjs/testing';

import { PrismaService } from '@/common/prisma';
import { EventBus } from '@/common/ddd';

import { OrganizationPrismaRepository } from '@/core/organization/infrastructure/prisma/organization.prisma.repository';
import { Organization } from '@/core/organization/domain/entities/organization.entity';
import { OrganizationCreatedEvent } from '@/core/organization/domain/events';

jest.mock('@/common/prisma', () => ({
  PrismaService: jest.fn(),
}));

describe('OrganizationPrismaRepository Integration', () => {
  let repository: OrganizationPrismaRepository;

  let prisma: PrismaService;

  let eventBus: EventBus;

  const prismaMock = {
    client: {
      organization: {
        create: jest.fn(),
      },
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

    repository = moduleRef.get(
      OrganizationPrismaRepository,
    );

    prisma = moduleRef.get(PrismaService);

    eventBus = moduleRef.get(EventBus);
  });

  it('should persist organization and publish domain events', async () => {

    prismaMock.client.organization.create.mockResolvedValue({
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
    });

    const publishSpy = jest.spyOn(
      eventBus,
      'publishAll',
    );

    const result = await repository.create(
      organization,
    );

    expect(
      prisma.client.organization.create,
    ).toHaveBeenCalledTimes(1);

    expect(publishSpy)
      .toHaveBeenCalledTimes(1);

    const events =
      publishSpy.mock.calls[0][0];

    expect(events).toHaveLength(1);

    const event =
    events[0] as OrganizationCreatedEvent;

expect(event.organizationId)
    .toBe('org-1');

expect(event.name)
    .toBe('Caelix');

expect(event.slug)
    .toBe('caelix');

    expect(
      (events[0] as OrganizationCreatedEvent)
        .organizationId,
    ).toBe('org-1');

    expect(
      organization.pullDomainEvents(),
    ).toHaveLength(0);

    expect(result)
      .toBeInstanceOf(Organization);

    expect(result.id)
      .toBe('org-1');

    expect(result.slug)
      .toBe('caelix');
  });
});