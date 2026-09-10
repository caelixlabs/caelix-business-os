import { Branch, PRIMARY_BRANCH_CODE } from '@/core/branch/domain/entities';
import { BranchCreatedEvent } from '@/core/branch/domain/events';
import { BranchStatus, BranchType } from '@/core/branch/domain/enums';

describe('Branch', () => {
  it('should create an active branch and record BranchCreatedEvent', () => {
    const branch = Branch.create({
      id: 'branch-1',
      organizationId: 'org-1',
      name: 'Main Branch',
      code: 'MAIN',
      type: BranchType.STANDARD,
    });

    expect(branch.status).toBe(BranchStatus.ACTIVE);
    expect(branch.code).toBe('MAIN');

    const events = branch.pullDomainEvents();
    expect(events).toHaveLength(1);
    expect(events[0]).toBeInstanceOf(BranchCreatedEvent);
    expect((events[0] as BranchCreatedEvent).organizationId).toBe('org-1');
  });

  it('createPrimary produces a PRIMARY branch with the deterministic DEFAULT code', () => {
    const branch = Branch.createPrimary('org-1', 'branch-primary');

    expect(branch.type).toBe(BranchType.PRIMARY);
    expect(branch.code).toBe(PRIMARY_BRANCH_CODE);
  });

  it('archive() throws for the PRIMARY branch', () => {
    const branch = Branch.createPrimary('org-1', 'branch-primary');

    expect(() => branch.archive()).toThrow(
      'The PRIMARY branch cannot be archived.',
    );
  });

  it('archive() succeeds for a STANDARD branch', () => {
    const branch = Branch.create({
      id: 'branch-2',
      organizationId: 'org-1',
      name: 'Second Branch',
      code: 'SECOND',
      type: BranchType.STANDARD,
    });

    branch.archive();

    expect(branch.status).toBe(BranchStatus.ARCHIVED);
  });
});
