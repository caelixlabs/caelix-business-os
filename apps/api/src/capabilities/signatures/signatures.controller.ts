import { Body, Controller, Get, HttpCode, Ip, Param, Post, Headers } from "@nestjs/common";

import { CurrentUser, Public } from "@/core/auth/application/decorators";
import type { AccessTokenPayload } from "@/core/auth/application/services/token.service";
import { RequirePermissions } from "@/core/rbac/application/decorators";
import { PermissionCode } from "@/core/rbac/domain/enums";
import { assertSameOrganization } from "@/core/audit/guards/assert-same-organization";

import { CreateSignatureRequestDto, DeclineDto, SignDto } from "./dto/signature.dto";
import { SignaturesService } from "./signatures.service";

@Controller("organizations/:organizationId/signatures")
export class SignaturesController {
  constructor(private readonly service: SignaturesService) {}

  @Get()
  @RequirePermissions(PermissionCode.SIGNATURE_READ)
  list(@Param("organizationId") organizationId: string, @CurrentUser() currentUser: AccessTokenPayload) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    return this.service.list(organizationId);
  }

  @Post()
  @RequirePermissions(PermissionCode.SIGNATURE_MANAGE)
  create(
    @Param("organizationId") organizationId: string,
    @Body() body: CreateSignatureRequestDto,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    return this.service.create(organizationId, currentUser.sub, body);
  }

  @Get(":id/link")
  @RequirePermissions(PermissionCode.SIGNATURE_MANAGE)
  link(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    return this.service.link(organizationId, id);
  }

  @Post(":id/cancel")
  @HttpCode(204)
  @RequirePermissions(PermissionCode.SIGNATURE_MANAGE)
  async cancel(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ): Promise<void> {
    assertSameOrganization(currentUser.organizationId, organizationId);
    await this.service.cancel(organizationId, id);
  }
}

@Public()
@Controller("public/signatures/:token")
export class PublicSignaturesController {
  constructor(private readonly service: SignaturesService) {}

  @Get()
  view(@Param("token") token: string) {
    return this.service.viewByToken(token);
  }

  @Post("sign")
  sign(
    @Param("token") token: string,
    @Body() body: SignDto,
    @Ip() ip: string,
    @Headers("user-agent") userAgent?: string,
  ) {
    return this.service.sign(token, body.typedName, body.agreed, { ip, userAgent });
  }

  @Post("decline")
  decline(@Param("token") token: string, @Body() body: DeclineDto) {
    return this.service.decline(token, body.reason);
  }
}
