import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";

import { CurrentUser } from "@/core/auth/application/decorators";
import type { AccessTokenPayload } from "@/core/auth/application/services/token.service";
import { RequirePermissions } from "@/core/rbac/application/decorators";
import { PermissionCode } from "@/core/rbac/domain/enums";
import { assertSameOrganization } from "@/core/audit/guards/assert-same-organization";

import { CreateContactUseCase } from "../../application/create-contact/create-contact.use-case";
import { CreateContactDto } from "../../application/dto/create-contact.dto";
import { GetContactHandler } from "../../application/get-contact/get-contact.handler";
import { ListContactsHandler } from "../../application/list-contacts/list-contacts.handler";
import { UpdateContactHandler } from "../../application/update-contact/update-contact.handler";
import { UpdateContactDto } from "../../application/update-contact/update-contact.dto";
import { ArchiveContactHandler } from "../../application/archive-contact/archive-contact.handler";
import { ActivateContactHandler } from "../../application/activate-contact/activate-contact.handler";
import { ContactResponseDto } from "../../application/dto/contact-response.dto";

@Controller("organizations/:organizationId/contacts")
export class ContactController {
  constructor(
    private readonly createContactUseCase: CreateContactUseCase,
    private readonly getContactHandler: GetContactHandler,
    private readonly listContactsHandler: ListContactsHandler,
    private readonly updateContactHandler: UpdateContactHandler,
    private readonly archiveContactHandler: ArchiveContactHandler,
    private readonly activateContactHandler: ActivateContactHandler,
  ) {}

  @Post()
  @RequirePermissions(PermissionCode.CONTACT_CREATE)
  async create(
    @Param("organizationId") organizationId: string,
    @Body() dto: CreateContactDto,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const contact = await this.createContactUseCase.execute(organizationId, dto);
    return ContactResponseDto.fromDomain(contact);
  }

  @Get()
  @RequirePermissions(PermissionCode.CONTACT_READ)
  async list(
    @Param("organizationId") organizationId: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const contacts = await this.listContactsHandler.execute({ organizationId });
    return ContactResponseDto.fromDomainList(contacts);
  }

  @Get(":id")
  @RequirePermissions(PermissionCode.CONTACT_READ)
  async get(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const contact = await this.getContactHandler.execute({ organizationId, id });
    return ContactResponseDto.fromDomain(contact);
  }

  @Patch(":id")
  @RequirePermissions(PermissionCode.CONTACT_UPDATE)
  async update(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @Body() dto: UpdateContactDto,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const contact = await this.updateContactHandler.execute(organizationId, id, dto);
    return ContactResponseDto.fromDomain(contact);
  }

  @Patch(":id/archive")
  @RequirePermissions(PermissionCode.CONTACT_ARCHIVE)
  async archive(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const contact = await this.archiveContactHandler.execute(organizationId, id);
    return ContactResponseDto.fromDomain(contact);
  }

  @Patch(":id/activate")
  @RequirePermissions(PermissionCode.CONTACT_ARCHIVE)
  async activate(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const contact = await this.activateContactHandler.execute(organizationId, id);
    return ContactResponseDto.fromDomain(contact);
  }
}
