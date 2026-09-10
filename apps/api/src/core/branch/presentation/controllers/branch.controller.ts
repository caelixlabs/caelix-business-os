import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

import { CurrentUser } from '@/core/auth/application/decorators';
import type { AccessTokenPayload } from '@/core/auth/application/services/token.service';
import { RequirePermissions } from '@/core/rbac/application/decorators';
import { PermissionCode } from '@/core/rbac/domain/enums';

import { CreateBranchDto } from '../../application/create-branch/create-branch.dto';
import { CreateBranchCommand } from '../../application/create-branch/create-branch.command';
import { CreateBranchHandler } from '../../application/create-branch/create-branch.handler';
import { GetBranchQuery } from '../../application/get-branch/get-branch.query';
import { GetBranchHandler } from '../../application/get-branch/get-branch.handler';
import { UpdateBranchDto } from '../../application/update-branch/update-branch.dto';
import { UpdateBranchCommand } from '../../application/update-branch/update-branch.command';
import { UpdateBranchHandler } from '../../application/update-branch/update-branch.handler';
import { ArchiveBranchCommand } from '../../application/archive-branch/archive-branch.command';
import { ArchiveBranchHandler } from '../../application/archive-branch/archive-branch.handler';
import { ActivateBranchCommand } from '../../application/activate-branch/activate-branch.command';
import { ActivateBranchHandler } from '../../application/activate-branch/activate-branch.handler';
import { DeleteBranchCommand } from '../../application/delete-branch/delete-branch.command';
import { DeleteBranchHandler } from '../../application/delete-branch/delete-branch.handler';
import { BranchResponseDto } from '../../application/dto/branch-response.dto';
import { ListBranchesHandler, ListBranchesQuery } from '../../application';
import { assertSameOrganization } from '@/core/audit/guards/assert-same-organization';

@Controller()
export class BranchController {
  constructor(
    private readonly createBranchHandler: CreateBranchHandler,
    private readonly getBranchHandler: GetBranchHandler,
    private readonly listBranchesHandler: ListBranchesHandler,
    private readonly updateBranchHandler: UpdateBranchHandler,
    private readonly archiveBranchHandler: ArchiveBranchHandler,
    private readonly activateBranchHandler: ActivateBranchHandler,
    private readonly deleteBranchHandler: DeleteBranchHandler,
  ) {}

  @Post('organizations/:organizationId/branches')
  @RequirePermissions(PermissionCode.BRANCH_CREATE)
  async create(
    @Param('organizationId') organizationId: string,
    @Body() dto: CreateBranchDto,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const branch = await this.createBranchHandler.execute(new CreateBranchCommand(organizationId, dto));
    return BranchResponseDto.fromDomain(branch);
  }

  @Get('organizations/:organizationId/branches')
  @RequirePermissions(PermissionCode.BRANCH_READ)
  async list(
    @Param('organizationId') organizationId: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const branches = await this.listBranchesHandler.execute(new ListBranchesQuery(organizationId));
    return branches.map(BranchResponseDto.fromDomain);
  }

  @Get('branches/:id')
  @RequirePermissions(PermissionCode.BRANCH_READ)
  async findOne(@Param('id') id: string, @CurrentUser() currentUser: AccessTokenPayload) {
    const branch = await this.getBranchHandler.execute(new GetBranchQuery(id, currentUser.organizationId));
    return BranchResponseDto.fromDomain(branch);
  }

  @Patch('branches/:id')
  @RequirePermissions(PermissionCode.BRANCH_UPDATE)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBranchDto,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    const branch = await this.updateBranchHandler.execute(
      new UpdateBranchCommand(id, currentUser.organizationId, dto),
    );
    return BranchResponseDto.fromDomain(branch);
  }

  @Patch('branches/:id/archive')
  @RequirePermissions(PermissionCode.BRANCH_ARCHIVE)
  async archive(@Param('id') id: string, @CurrentUser() currentUser: AccessTokenPayload) {
    const branch = await this.archiveBranchHandler.execute(
      new ArchiveBranchCommand(id, currentUser.organizationId),
    );
    return BranchResponseDto.fromDomain(branch);
  }

  @Patch('branches/:id/activate')
  @RequirePermissions(PermissionCode.BRANCH_ARCHIVE)
  async activate(@Param('id') id: string, @CurrentUser() currentUser: AccessTokenPayload) {
    const branch = await this.activateBranchHandler.execute(
      new ActivateBranchCommand(id, currentUser.organizationId),
    );
    return BranchResponseDto.fromDomain(branch);
  }

  @Delete('branches/:id')
  @RequirePermissions(PermissionCode.BRANCH_DELETE)
  async delete(@Param('id') id: string, @CurrentUser() currentUser: AccessTokenPayload) {
    await this.deleteBranchHandler.execute(
      new DeleteBranchCommand(id, currentUser.organizationId),
    );
  }
}