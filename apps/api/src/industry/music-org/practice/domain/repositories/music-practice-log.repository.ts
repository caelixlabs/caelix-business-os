import { MusicPracticeLog } from '../entities/music-practice-log.entity';

export interface MusicPracticeLogRepository {
  create(
    log: MusicPracticeLog,
  ): Promise<MusicPracticeLog>;

  findByStudent(
    organizationId: string,
    studentId: string,
  ): Promise<MusicPracticeLog[]>;
}