import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from "@nestjs/common";
import type { Message, MessageChannel, MessageTemplate } from "@caelix-business-os/database";

import { PrismaService } from "@/common/prisma";
import { CurrentUser } from "@/core/auth/application/decorators";
import type { AccessTokenPayload } from "@/core/auth/application/services/token.service";
import { RequirePermissions } from "@/core/rbac/application/decorators";
import { PermissionCode } from "@/core/rbac/domain/enums";
import { assertSameOrganization } from "@/core/audit/guards/assert-same-organization";

import { CommunicationService } from "./communication.service";
import { CreateTemplateDto, SendMessageDto, UpdateTemplateDto } from "./dto/communication.dto";
import { TemplatesService } from "./templates.service";

@Controller("organizations/:organizationId/communication")
export class CommunicationController {
  constructor(
    private readonly communication: CommunicationService,
    private readonly templates: TemplatesService,
    private readonly prisma: PrismaService,
  ) {}

  @Get("channels")
  @RequirePermissions(PermissionCode.COMMUNICATION_READ)
  channels(): Record<MessageChannel, boolean> {
    return this.communication.channelStatus();
  }

  @Get("messages")
  @RequirePermissions(PermissionCode.COMMUNICATION_READ)
  async messages(
    @Param("organizationId") organizationId: string,
    @Query("contactId") contactId: string | undefined,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    return this.prisma.client.message.findMany({
      where: { organizationId, ...(contactId ? { contactId } : {}) },
      include: { contact: { select: { id: true, firstName: true, lastName: true, companyName: true } } },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
  }

  @Post("messages")
  @RequirePermissions(PermissionCode.COMMUNICATION_SEND)
  send(
    @Param("organizationId") organizationId: string,
    @Body() body: SendMessageDto,
    @CurrentUser() currentUser: AccessTokenPayload,
  ): Promise<Message> {
    assertSameOrganization(currentUser.organizationId, organizationId);
    return this.communication.send({ ...body, organizationId, source: "manual", sentByUserId: currentUser.sub });
  }

  @Get("templates")
  @RequirePermissions(PermissionCode.COMMUNICATION_READ)
  listTemplates(
    @Param("organizationId") organizationId: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ): Promise<MessageTemplate[]> {
    assertSameOrganization(currentUser.organizationId, organizationId);
    return this.templates.list(organizationId);
  }

  @Post("templates")
  @RequirePermissions(PermissionCode.COMMUNICATION_MANAGE)
  createTemplate(
    @Param("organizationId") organizationId: string,
    @Body() body: CreateTemplateDto,
    @CurrentUser() currentUser: AccessTokenPayload,
  ): Promise<MessageTemplate> {
    assertSameOrganization(currentUser.organizationId, organizationId);
    return this.templates.create(organizationId, body);
  }

  @Patch("templates/:id")
  @RequirePermissions(PermissionCode.COMMUNICATION_MANAGE)
  updateTemplate(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @Body() body: UpdateTemplateDto,
    @CurrentUser() currentUser: AccessTokenPayload,
  ): Promise<MessageTemplate> {
    assertSameOrganization(currentUser.organizationId, organizationId);
    return this.templates.update(organizationId, id, body);
  }

  @Delete("templates/:id")
  @HttpCode(204)
  @RequirePermissions(PermissionCode.COMMUNICATION_MANAGE)
  async removeTemplate(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ): Promise<void> {
    assertSameOrganization(currentUser.organizationId, organizationId);
    await this.templates.remove(organizationId, id);
  }
}
