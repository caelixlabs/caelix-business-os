import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@/common/prisma/prisma.service';
import { EventBus } from '@/common/ddd';

import { BranchPrismaRepository } from '@/core/branch/infrastructure/prisma/branch.prisma.repository';
import { Branch } from '@/core/branch/domain/entities';
import { BranchCreatedEvent } from '@/core/branch/domain/events';
import { BranchStatus } from '@/core/branch/domain/enums';


jest.mock('@/common/prisma/prisma.service', () => ({
  PrismaService: class {},
}));

describe('BranchPrismaRepository Integration', () => {
  let repository: BranchPrismaRepository;

  const prismaMock = {
    client: {
      branch: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    },
  };

  const eventBusMock = {
    publish: jest.fn(),
    publishAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          BranchPrismaRepository,
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

    repository =
      module.get(BranchPrismaRepository);

    jest.clearAllMocks();
  });

  it('should persist branch and publish domain events', async () => {
    const branch = Branch.create({
      id: 'branch-1',
      organizationId: 'org-1',
      name: 'Main Branch',
      code: 'MAIN',
    });

    prismaMock.client.branch.create.mockResolvedValue({
      id: 'branch-1',
      organizationId: 'org-1',
      name: 'Main Branch',
      code: 'MAIN',
      description: null,
      status: BranchStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await repository.create(branch);

    expect(prismaMock.client.branch.create)
      .toHaveBeenCalledWith({
        data: {
          id: 'branch-1',
          organizationId: 'org-1',
          name: 'Main Branch',
          code: 'MAIN',
          description: undefined,
          status: BranchStatus.ACTIVE,
        },
      });

    expect(eventBusMock.publishAll)
      .toHaveBeenCalledTimes(1);

    const events =
      eventBusMock.publishAll.mock.calls[0][0];

    expect(events).toHaveLength(1);

    expect(events[0]).toBeInstanceOf(
      BranchCreatedEvent,
    );

    expect(events[0].branchId).toBe('branch-1');
    expect(events[0].organizationId).toBe('org-1');
    expect(events[0].name).toBe('Main Branch');

    expect(branch.pullDomainEvents()).toHaveLength(0);

    expect(result).toBeInstanceOf(Branch);
    expect(result.id).toBe('branch-1');
  });
});