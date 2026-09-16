import { Module } from "@nestjs/common";

import { DocumentsController } from "./documents.controller";
import { DocumentsService } from "./documents.service";
import { LocalDiskStorageService } from "./local-disk-storage.service";

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService, LocalDiskStorageService],
})
export class DocumentsModule {}
