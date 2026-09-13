import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";

import { CurrentUser } from "@/core/auth/application/decorators";
import type { AccessTokenPayload } from "@/core/auth/application/services/token.service";
import { RequirePermissions } from "@/core/rbac/application/decorators";
import { PermissionCode } from "@/core/rbac/domain/enums";
import { assertSameOrganization } from "@/core/audit/guards/assert-same-organization";

import { CreateEnquiryHandler } from "../../application/create-enquiry/create-enquiry.handler";
import { CreateEnquiryDto } from "../../application/create-enquiry/create-enquiry.dto";
import { GetEnquiryHandler } from "../../application/get-enquiry/get-enquiry.handler";
import { ListEnquiriesHandler } from "../../application/list-enquiries/list-enquiries.handler";
import { UpdateEnquiryStatusHandler } from "../../application/update-enquiry-status/update-enquiry-status.handler";
import { UpdateEnquiryStatusDto } from "../../application/update-enquiry-status/update-enquiry-status.dto";
import { UpdateEnquiryDetailsHandler } from "../../application/update-enquiry-details/update-enquiry-details.handler";
import { UpdateEnquiryDetailsDto } from "../../application/update-enquiry-details/update-enquiry-details.dto";
import { AssignEnquiryHandler } from "../../application/assign-enquiry/assign-enquiry.handler";
import { AssignEnquiryDto } from "../../application/assign-enquiry/assign-enquiry.dto";
import { EnquiryResponseDto } from "../../application/dto/enquiry-response.dto";

@Controller("organizations/:organizationId/enquiries")
export class EnquiryController {
  constructor(
    private readonly createEnquiryHandler: CreateEnquiryHandler,
    private readonly getEnquiryHandler: GetEnquiryHandler,
    private readonly listEnquiriesHandler: ListEnquiriesHandler,
    private readonly updateEnquiryStatusHandler: UpdateEnquiryStatusHandler,
    private readonly updateEnquiryDetailsHandler: UpdateEnquiryDetailsHandler,
    private readonly assignEnquiryHandler: AssignEnquiryHandler,
  ) {}

  @Post()
  @RequirePermissions(PermissionCode.ENQUIRY_CREATE)
  async create(
    @Param("organizationId") organizationId: string,
    @Body() dto: CreateEnquiryDto,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const enquiry = await this.createEnquiryHandler.execute(organizationId, dto);
    return EnquiryResponseDto.fromDomain(enquiry);
  }

  @Get()
  @RequirePermissions(PermissionCode.ENQUIRY_READ)
  async list(
    @Param("organizationId") organizationId: string,
    @Query("branchId") branchId: string | undefined,
    @Query("contactId") contactId: string | undefined,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const enquiries = await this.listEnquiriesHandler.execute({ organizationId, branchId, contactId });
    return EnquiryResponseDto.fromDomainList(enquiries);
  }

  @Get(":id")
  @RequirePermissions(PermissionCode.ENQUIRY_READ)
  async get(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const enquiry = await this.getEnquiryHandler.execute({ organizationId, enquiryId: id });
    return EnquiryResponseDto.fromDomain(enquiry);
  }

  @Patch(":id")
  @RequirePermissions(PermissionCode.ENQUIRY_MANAGE)
  async update(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @Body() dto: UpdateEnquiryDetailsDto,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const enquiry = await this.updateEnquiryDetailsHandler.execute(organizationId, id, dto);
    return EnquiryResponseDto.fromDomain(enquiry);
  }

  @Patch(":id/status")
  @RequirePermissions(PermissionCode.ENQUIRY_MANAGE)
  async updateStatus(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @Body() dto: UpdateEnquiryStatusDto,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const enquiry = await this.updateEnquiryStatusHandler.execute(organizationId, id, dto);
    return EnquiryResponseDto.fromDomain(enquiry);
  }

  @Patch(":id/assign")
  @RequirePermissions(PermissionCode.ENQUIRY_MANAGE)
  async assign(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @Body() dto: AssignEnquiryDto,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const enquiry = await this.assignEnquiryHandler.execute(organizationId, id, dto);
    return EnquiryResponseDto.fromDomain(enquiry);
  }
}
