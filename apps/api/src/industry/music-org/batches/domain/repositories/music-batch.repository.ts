import { MusicBatch } from '../entities/music-batch.entity';

export interface MusicBatchRepository {
  create(batch: MusicBatch): Promise<MusicBatch>;
  findByOrganization(organizationId: string): Promise<MusicBatch[]>;
  findById(id: string, organizationId: string): Promise<MusicBatch | null>;
}