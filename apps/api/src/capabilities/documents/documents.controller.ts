import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Response } from "express";

import { CurrentUser } from "@/core/auth/application/decorators";
import type { AccessTokenPayload } from "@/core/auth/application/services/token.service";
import { RequirePermissions } from "@/core/rbac/application/decorators";
import { PermissionCode } from "@/core/rbac/domain/enums";
import { assertSameOrganization } from "@/core/audit/guards/assert-same-organization";

import { DocumentsService } from "./documents.service";
import { UploadDocumentDto } from "./dto/upload-document.dto";
import { ListDocumentsDto } from "./dto/list-documents.dto";
import { DocumentResponseDto } from "./dto/document-response.dto";

@Controller("organizations/:organizationId/documents")
export class DocumentsController {
  constructor(private readonly service: DocumentsService) {}

  @Post()
  @RequirePermissions(PermissionCode.DOCUMENT_CREATE)
  @UseInterceptors(FileInterceptor("file"))
  async upload(
    @Param("organizationId") organizationId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadDocumentDto,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);

    if (!file) {
      throw new BadRequestException("A file is required.");
    }

    const document = await this.service.upload(organizationId, {
      branchId: body.branchId,
      entityType: body.entityType,
      entityId: body.entityId,
      uploadedByUserId: currentUser.sub,
      file,
    });

    return DocumentResponseDto.fromDomain(document);
  }

  @Get()
  @RequirePermissions(PermissionCode.DOCUMENT_READ)
  async list(
    @Param("organizationId") organizationId: string,
    @Query() query: ListDocumentsDto,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const documents = await this.service.list(organizationId, query.entityType, query.entityId);
    return DocumentResponseDto.fromDomainList(documents);
  }

  @Get(":id/download")
  @RequirePermissions(PermissionCode.DOCUMENT_READ)
  async download(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @CurrentUser() currentUser: AccessTokenPayload,
    @Res() res: Response,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const { document, buffer } = await this.service.getForDownload(organizationId, id);

    res.set({
      "Content-Type": document.mimeType,
      "Content-Disposition": `attachment; filename="${document.fileName}"`,
    });
    res.send(buffer);
  }

  @Delete(":id")
  @RequirePermissions(PermissionCode.DOCUMENT_DELETE)
  async remove(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    await this.service.delete(organizationId, id);
    return { success: true };
  }
}
