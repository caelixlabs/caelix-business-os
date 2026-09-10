
import { UserRegisteredEvent } from '@/core/users/domain/events';
import { RoleLevel } from '@/core/rbac/domain/enums';
import type { RbacRepository } from '@/core/rbac/domain/repositories';
import { AssignDefaultRoleHandler } from '@/core/rbac/application/event-handlers/assign-default-role.handler';

describe('AssignDefaultRoleHandler', () => {
  let rbacRepository: jest.Mocked<RbacRepository>;
  let handler: AssignDefaultRoleHandler;

  beforeEach(() => {
    rbacRepository = {
      assignSystemRole: jest.fn(),
      getEffectiveAccess: jest.fn(),
      hasOwner: jest.fn(),
      listRolesForOrganization: jest.fn(),
      getUserRole: jest.fn(),
      setUserRole: jest.fn(),
    };
    handler = new AssignDefaultRoleHandler(rbacRepository);
  });

  it('assigns OWNER when the organization has no owner yet', async () => {
    rbacRepository.hasOwner.mockResolvedValue(false);

    await handler.handle(
      new UserRegisteredEvent('user-1', 'org-1', 'owner@example.com'),
    );

    expect(rbacRepository.assignSystemRole).toHaveBeenCalledWith({
      userId: 'user-1',
      organizationId: 'org-1',
      level: RoleLevel.OWNER,
    });
  });

  it('assigns EMPLOYEE when the organization already has an owner', async () => {
    rbacRepository.hasOwner.mockResolvedValue(true);

    await handler.handle(
      new UserRegisteredEvent('user-2', 'org-1', 'teammate@example.com'),
    );

    expect(rbacRepository.assignSystemRole).toHaveBeenCalledWith({
      userId: 'user-2',
      organizationId: 'org-1',
      level: RoleLevel.EMPLOYEE,
    });
  });
});