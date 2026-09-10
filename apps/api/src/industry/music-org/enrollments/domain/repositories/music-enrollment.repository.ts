import { MusicEnrollment } from '../entities/music-enrollment.entity';

export interface MusicEnrollmentRepository {
  create(
    enrollment: MusicEnrollment,
  ): Promise<MusicEnrollment>;

  findByOrganization(
    organizationId: string,
  ): Promise<MusicEnrollment[]>;
}