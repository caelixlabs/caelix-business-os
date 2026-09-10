import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";

import { Public, CurrentUser } from "@/core/auth/application/decorators";
import type { AccessTokenPayload } from "@/core/auth/application/services/token.service";
import { RequirePermissions } from "@/core/rbac/application/decorators";
import { PermissionCode } from "@/core/rbac/domain/enums";

import { CreateOrganizationHandler } from "../../application/create-organization/create-organization.handler";
import { CreateOrganizationDto } from "../../application/create-organization/create-organization.dto";
import { CreateOrganizationCommand } from "../../application/create-organization/create-organization.command";
import { GetOrganizationHandler } from "../../application/get-organization/get-organization.handler";
import { GetOrganizationQuery } from "../../application/get-organization/get-organization.query";
import { UpdateOrganizationDto } from "../../application/update-organization/update-organization.dto";
import { UpdateOrganizationCommand } from "../../application/update-organization/update-organization.command";
import { UpdateOrganizationHandler } from "../../application/update-organization/update-organization.handler";
import { DeleteOrganizationCommand } from "../../application/delete-organization/delete-organizations.command";
import { DeleteOrganizationHandler } from "../../application/delete-organization/delete-organizations.handler";
import { OrganizationResponseDto } from "../../application/dto/organization-response.dto";
import { assertSameOrganization } from "@/core/audit/guards/assert-same-organization";

@Controller('organizations')
export class OrganizationController {
  constructor(
    private readonly createOrganizationHandler: CreateOrganizationHandler,
    private readonly getOrganizationHandler: GetOrganizationHandler,
    private readonly updateOrganizationHandler: UpdateOrganizationHandler,
    private readonly deleteOrganizationHandler: DeleteOrganizationHandler,
  ) {}

  @Public()
  @Post()
  async create(@Body() dto: CreateOrganizationDto) {
    const org = await this.createOrganizationHandler.execute(new CreateOrganizationCommand(dto));
    return OrganizationResponseDto.fromDomain(org);
  }

  @Get(':id')
  @RequirePermissions(PermissionCode.ORGANIZATION_READ)
  async findOne(@Param('id') id: string, @CurrentUser() currentUser: AccessTokenPayload) {
    assertSameOrganization(currentUser.organizationId, id);
    const org = await this.getOrganizationHandler.execute(new GetOrganizationQuery(id));
    return OrganizationResponseDto.fromDomain(org);
  }

  @Patch(':id')
  @RequirePermissions(PermissionCode.ORGANIZATION_UPDATE)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateOrganizationDto,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, id);
    const org = await this.updateOrganizationHandler.execute(new UpdateOrganizationCommand(id, dto));
    return OrganizationResponseDto.fromDomain(org);
  }

  @Delete(':id')
  @RequirePermissions(PermissionCode.ORGANIZATION_DELETE)
  async delete(@Param('id') id: string, @CurrentUser() currentUser: AccessTokenPayload) {
    assertSameOrganization(currentUser.organizationId, id);
    await this.deleteOrganizationHandler.execute(new DeleteOrganizationCommand(id));
  }
}