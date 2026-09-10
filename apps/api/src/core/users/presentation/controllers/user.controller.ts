import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';

import { CurrentUser } from '@/core/auth/application/decorators';
import type { AccessTokenPayload } from '@/core/auth/application/services/token.service';
import { RequirePermissions } from '@/core/rbac/application/decorators';
import { PermissionCode } from '@/core/rbac/domain/enums';
import { RBAC_REPOSITORY } from '@/core/rbac/domain/repositories';
import type { RbacRepository } from '@/core/rbac/domain/repositories';
import { Inject } from '@nestjs/common';

import { GetUserQuery } from '../../application/get-user/get-user.query';
import { GetUserHandler } from '../../application/get-user/get-user.handler';
import { UserResponseDto } from '../../application/dto/user-response.dto';
import { ListUsersHandler, ListUsersQuery } from '../../application';
import { assertSameOrganization } from '@/core/audit/guards/assert-same-organization';
import { InviteUserHandler } from '../../application/invite-user/invite-user.handler';
import { InviteUserCommand } from '../../application/invite-user/invite-user.command';
import { InviteUserDto } from '../../application/invite-user/invite-user.dto';
import { AssignRoleDto } from '../../application/assign-role/assign-role.dto';
import { AssignRoleCommand } from '../../application/assign-role/assign-role.command';
import { AssignRoleHandler } from '../../application/assign-role/assign-role.handler';
import { UpdateUserStatusHandler } from '../../application/update-status/update-user-status.handler';
import { AssignBranchHandler } from '../../application/assign-branch/assign-branch.handler';
import { UpdateUserStatusDto } from '../../application/update-status/update-user-status.dto';
import { UpdateUserStatusCommand } from '../../application/update-status/update-user-status.command';
import { AssignBranchCommand } from '../../application/assign-branch/assign-branch.command';
import { AssignBranchDto } from '../../application/assign-branch/assign-branch.dto';

@Controller()
export class UserController {
  constructor(
    private readonly getUserHandler: GetUserHandler,
    private readonly listUsersHandler: ListUsersHandler,
    private readonly inviteUserHandler: InviteUserHandler,
    private readonly assignRoleHandler: AssignRoleHandler,
    @Inject(RBAC_REPOSITORY) private readonly rbacRepository: RbacRepository,
    private readonly updateUserStatusHandler: UpdateUserStatusHandler,
    private readonly assignBranchHandler: AssignBranchHandler,
  ) { }

  @Get('users/:id')
  @RequirePermissions(PermissionCode.USER_READ)
  async findOne(
    @Param('id') id: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    const user = await this.getUserHandler.execute(new GetUserQuery(id, currentUser.organizationId));
    const role = await this.rbacRepository.getUserRole(user.id);
    return UserResponseDto.fromDomain(user, role);
  }

  @Get('organizations/:organizationId/users')
  @RequirePermissions(PermissionCode.USER_READ)
  async list(
    @Param('organizationId') organizationId: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);

    const users = await this.listUsersHandler.execute(new ListUsersQuery(organizationId));
    return Promise.all(
      users.map(async (user) => {
        const role = await this.rbacRepository.getUserRole(user.id);
        return UserResponseDto.fromDomain(user, role);
      }),
    );
  }

  @Post('organizations/:organizationId/users')
  @RequirePermissions(PermissionCode.USER_INVITE)
  async invite(
    @Param('organizationId') organizationId: string,
    @Body() dto: InviteUserDto,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);

    const user = await this.inviteUserHandler.execute(new InviteUserCommand(organizationId, dto));
    const role = await this.rbacRepository.getUserRole(user.id);
    return UserResponseDto.fromDomain(user, role);
  }

  @Patch('users/:id/role')
  @RequirePermissions(PermissionCode.USER_ROLE_ASSIGN)
  async assignRole(
    @Param('id') id: string,
    @Body() dto: AssignRoleDto,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    const [user, role] = await this.assignRoleHandler.execute(
      new AssignRoleCommand(id, currentUser.organizationId, dto.roleId)
    );

    // const role = await this.rbacRepository.getUserRole(user.id);

    return UserResponseDto.fromDomain(user, role);
  }

  @Patch('users/:id/status')
  @RequirePermissions(PermissionCode.USER_SUSPEND)
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusDto,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    const user = await this.updateUserStatusHandler.execute(
      new UpdateUserStatusCommand(id, currentUser.organizationId, dto.status),
    );

    const role = await this.rbacRepository.getUserRole(user.id);

    return UserResponseDto.fromDomain(user, role);
  }

  @Patch('users/:id/branch')
  @RequirePermissions(PermissionCode.USER_UPDATE)
  async assignBranch(
    @Param('id') id: string,
    @Body() dto: AssignBranchDto,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    const user = await this.assignBranchHandler.execute(
      new AssignBranchCommand(id, currentUser.organizationId, dto.branchId),
    );

    const role = await this.rbacRepository.getUserRole(user.id);

    return UserResponseDto.fromDomain(user, role);
  }
}
