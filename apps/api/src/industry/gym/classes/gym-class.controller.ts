import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";

import { CurrentUser } from "@/core/auth/application/decorators";
import type { AccessTokenPayload } from "@/core/auth/application/services/token.service";
import { RequirePermissions } from "@/core/rbac/application/decorators";
import { RequireIndustry } from "@/core/organization/application/decorators";
import { PermissionCode } from "@/core/rbac/domain/enums";
import { IndustryType } from "@/core/organization/domain/enums/industry-type.enum";
import { assertSameOrganization } from "@/core/audit/guards/assert-same-organization";

import { GymClassService } from "./gym-class.service";
import { CreateGymClassDto } from "./dto/create-gym-class.dto";
import { UpdateGymClassDto } from "./dto/update-gym-class.dto";

@Controller("organizations/:organizationId/gym/classes")
@RequireIndustry(IndustryType.GYM)
export class GymClassController {
  constructor(private readonly service: GymClassService) {}

  @Post()
  @RequirePermissions(PermissionCode.GYM_CLASS_MANAGE)
  create(
    @Param("organizationId") organizationId: string,
    @Body() body: CreateGymClassDto,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    return this.service.create(organizationId, body);
  }

  @Get()
  @RequirePermissions(PermissionCode.GYM_CLASS_READ)
  list(
    @Param("organizationId") organizationId: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    return this.service.list(organizationId);
  }

  @Get(":id")
  @RequirePermissions(PermissionCode.GYM_CLASS_READ)
  get(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    return this.service.get(organizationId, id);
  }

  @Patch(":id")
  @RequirePermissions(PermissionCode.GYM_CLASS_MANAGE)
  update(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @Body() body: UpdateGymClassDto,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    return this.service.update(organizationId, id, body);
  }
}
