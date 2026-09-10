// import { Body, Controller, Get, Param, Put } from '@nestjs/common';
// import { CurrentUser } from '@/core/auth/application/decorators';
// import type { AccessTokenPayload } from '@/core/auth/application/services/token.service';
// import { RequirePermissions } from '@/core/rbac/application/decorators';
// import { PermissionCode } from '@/core/rbac/domain/enums';
// import { assertSameOrganization } from '@/core/audit/guards/assert-same-organization';
// import { Industry } from '../industry.enum';
// import { WorkspaceService } from './workspace.service';
// import { IsEnum } from 'class-validator';

// class SetWorkspaceIndustryDto {
//   @IsEnum(Industry)
//   industry!: Industry;
// }

// @Controller('organizations/:organizationId/workspace')
// export class WorkspaceController {
//   constructor(private readonly service: WorkspaceService) {}

//   @Get()
//   @RequirePermissions(PermissionCode.ORGANIZATION_READ)
//   get(@Param('organizationId') organizationId: string, @CurrentUser() user: AccessTokenPayload) {
//     assertSameOrganization(user.organizationId, organizationId);
//     return this.service.get(organizationId);
//   }

//   @Put()
//   @RequirePermissions(PermissionCode.ORGANIZATION_UPDATE)
//   setIndustry(@Param('organizationId') organizationId: string, @Body() dto: SetWorkspaceIndustryDto, @CurrentUser() user: AccessTokenPayload) {
//     assertSameOrganization(user.organizationId, organizationId);
//     return this.service.setIndustry(organizationId, dto.industry);
//   }
// }
