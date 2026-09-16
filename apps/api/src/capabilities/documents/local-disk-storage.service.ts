import { Injectable } from "@nestjs/common";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const UPLOAD_ROOT = process.env.DOCUMENT_STORAGE_PATH ?? join(process.cwd(), "uploads");

/**
 * Local-filesystem storage for dev. Swapping to S3 or another
 * object store later only means replacing this one class — nothing
 * above it (DocumentsService, the controller, the schema) knows or
 * cares how a storageKey resolves to bytes.
 */
@Injectable()
export class LocalDiskStorageService {
  async save(storageKey: string, buffer: Buffer): Promise<void> {
    const filePath = join(UPLOAD_ROOT, storageKey);
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, buffer);
  }

  read(storageKey: string): Promise<Buffer> {
    return readFile(join(UPLOAD_ROOT, storageKey));
  }

  remove(storageKey: string): Promise<void> {
    return rm(join(UPLOAD_ROOT, storageKey), { force: true });
  }
}
