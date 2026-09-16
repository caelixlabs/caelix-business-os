import type { Document } from "@caelix-business-os/database";

export class DocumentResponseDto {
  id!: string;
  entityType!: string;
  entityId!: string;
  fileName!: string;
  mimeType!: string;
  sizeBytes!: number;
  uploadedByUserId?: string;
  createdAt!: Date;

  static fromDomain(document: Document): DocumentResponseDto {
    const dto = new DocumentResponseDto();
    dto.id = document.id;
    dto.entityType = document.entityType;
    dto.entityId = document.entityId;
    dto.fileName = document.fileName;
    dto.mimeType = document.mimeType;
    dto.sizeBytes = document.sizeBytes;
    dto.uploadedByUserId = document.uploadedByUserId ?? undefined;
    dto.createdAt = document.createdAt;
    return dto;
  }

  static fromDomainList(documents: Document[]): DocumentResponseDto[] {
    return documents.map((document) => DocumentResponseDto.fromDomain(document));
  }
}
