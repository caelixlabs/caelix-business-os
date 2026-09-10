import { MusicAttendance } from '../entities/music-attendance.entity';

export interface MusicAttendanceRepository {
  upsert(
    attendance: MusicAttendance,
  ): Promise<MusicAttendance>;

  findByBatch(
    organizationId: string,
    batchId: string,
    date: Date,
  ): Promise<MusicAttendance[]>;
}