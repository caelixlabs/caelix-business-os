import { MusicStudent } from '../entities/music-student.entity';

export interface MusicStudentRepository {
  create(student: MusicStudent): Promise<MusicStudent>;

  findById(
    id: string,
    organizationId: string,
  ): Promise<MusicStudent | null>;

  findByOrganization(
    organizationId: string,
  ): Promise<MusicStudent[]>;

  update(student: MusicStudent): Promise<MusicStudent>;
}
