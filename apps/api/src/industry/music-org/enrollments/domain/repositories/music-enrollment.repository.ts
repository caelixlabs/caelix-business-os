import { MusicEnrollment } from '../entities/music-enrollment.entity';

export interface MusicEnrollmentFilters {
  batchId?: string;
  studentId?: string;
}

export interface MusicEnrollmentRepository {
  create(
    enrollment: MusicEnrollment,
  ): Promise<MusicEnrollment>;

  findByOrganization(
    organizationId: string,
    filters?: MusicEnrollmentFilters,
  ): Promise<MusicEnrollment[]>;

  findById(
    id: string,
    organizationId: string,
  ): Promise<MusicEnrollment | null>;

  update(
    enrollment: MusicEnrollment,
  ): Promise<MusicEnrollment>;
}