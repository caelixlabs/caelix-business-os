import { Branch } from '@/core/branch/domain/entities';

import {
  BranchCreatedEvent,
} from '@/core/branch/domain/events';

import {
  BranchStatus,
} from '@/core/branch/domain/enums';

describe('Branch', () => {

  it('should create an active branch', () => {

    const branch = Branch.create({

      id: 'branch-1',

      organizationId: 'org-1',

      name: 'Main Branch',

      code: 'MAIN',

    });

    expect(branch.status)
      .toBe(BranchStatus.ACTIVE);

    const events =
      branch.pullDomainEvents();

    expect(events)
      .toHaveLength(1);

    expect(events[0])
      .toBeInstanceOf(
        BranchCreatedEvent,
      );

    expect(
      (events[0] as BranchCreatedEvent)
        .organizationId,
    ).toBe('org-1');

  });

});