import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@/common/prisma/prisma.service';
import { EventBus } from '@/common/ddd';

import { BranchPrismaRepository } from '@/core/branch/infrastructure/prisma/branch.prisma.repository';
import { Branch } from '@/core/branch/domain/entities';
import { BranchCreatedEvent } from '@/core/branch/domain/events';
import { BranchStatus, BranchType } from '@/core/branch/domain/enums';


jest.mock('@/common/prisma/prisma.service', () => ({
  PrismaService: class {},
}));

describe('BranchPrismaRepository Integration', () => {
  let repository: BranchPrismaRepository;

  const txClient = {
    branch: {
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

  it('should persist branch and its domain event atomically, then publish', async () => {
    const branch = Branch.create({
      id: 'branch-1',
      organizationId: 'org-1',
      name: 'Main Branch',
      code: 'MAIN',
      type: BranchType.STANDARD,
    });

    txClient.branch.create.mockResolvedValue({
      id: 'branch-1',
      organizationId: 'org-1',
      name: 'Main Branch',
      code: 'MAIN',
      description: null,
      type: BranchType.STANDARD,
      status: BranchStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await repository.create(branch);

    // Aggregate write and outbox write both happened inside the same
    // $transaction callback — this is the Outbox Pattern guarantee.
    expect(prismaMock.client.$transaction).toHaveBeenCalledTimes(1);
    expect(txClient.branch.create).toHaveBeenCalledTimes(1);
    expect(txClient.domainEvent.createMany).toHaveBeenCalledTimes(1);

    const outboxRows = txClient.domainEvent.createMany.mock.calls[0][0].data;
    expect(outboxRows).toHaveLength(1);
    expect(outboxRows[0].eventName).toBe('BranchCreatedEvent');
    expect(outboxRows[0].aggregateId).toBe('branch-1');

    // Publish only happens after the transaction resolves.
    expect(eventBusMock.publishAll).toHaveBeenCalledTimes(1);
    const events = eventBusMock.publishAll.mock.calls[0][0];
    expect(events).toHaveLength(1);
    expect(events[0]).toBeInstanceOf(BranchCreatedEvent);
    expect(events[0].branchId).toBe('branch-1');
    expect(events[0].organizationId).toBe('org-1');

    expect(branch.pullDomainEvents()).toHaveLength(0);
    expect(result).toBeInstanceOf(Branch);
    expect(result.id).toBe('branch-1');
  });
});
