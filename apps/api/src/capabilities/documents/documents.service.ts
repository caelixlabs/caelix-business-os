import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "@/common/prisma";
import { customUUID } from "@/kernel/utility/uuid";

import { LocalDiskStorageService } from "./local-disk-storage.service";

export interface UploadDocumentInput {
  branchId?: string;
  entityType: string;
  entityId: string;
  uploadedByUserId: string;
  file: Express.Multer.File;
}

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: LocalDiskStorageService,
  ) {}

  async upload(organizationId: string, input: UploadDocumentInput) {
    const id = customUUID.generate();
    const storageKey = `${organizationId}/${id}-${input.file.originalname}`;

    await this.storage.save(storageKey, input.file.buffer);

    return this.prisma.client.document.create({
      data: {
        id,
        organizationId,
        branchId: input.branchId,
        entityType: input.entityType,
        entityId: input.entityId,
        fileName: input.file.originalname,
        mimeType: input.file.mimetype,
        sizeBytes: input.file.size,
        storageKey,
        uploadedByUserId: input.uploadedByUserId,
      },
    });
  }

  list(organizationId: string, entityType: string, entityId: string) {
    return this.prisma.client.document.findMany({
      where: { organizationId, entityType, entityId },
      orderBy: { createdAt: "desc" },
    });
  }

  private async findOwned(organizationId: string, id: string) {
    const document = await this.prisma.client.document.findFirst({
      where: { id, organizationId },
    });

    if (!document) {
      throw new NotFoundException("Document not found.");
    }

    return document;
  }

  async getForDownload(organizationId: string, id: string) {
    const document = await this.findOwned(organizationId, id);
    const buffer = await this.storage.read(document.storageKey);
    return { document, buffer };
  }

  async delete(organizationId: string, id: string): Promise<void> {
    const document = await this.findOwned(organizationId, id);
    await this.storage.remove(document.storageKey);
    await this.prisma.client.document.delete({ where: { id: document.id } });
  }
}
