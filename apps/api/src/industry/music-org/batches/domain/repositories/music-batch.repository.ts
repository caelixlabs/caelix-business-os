import { MusicBatch } from '../entities/music-batch.entity';

export interface MusicBatchFilters {
  courseId?: string;
  teacherUserId?: string;
}

export interface MusicBatchRepository {
  create(batch: MusicBatch): Promise<MusicBatch>;
  findByOrganization(organizationId: string, filters?: MusicBatchFilters): Promise<MusicBatch[]>;
  findById(id: string, organizationId: string): Promise<MusicBatch | null>;
  update(batch: MusicBatch): Promise<MusicBatch>;
}