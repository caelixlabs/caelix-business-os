import { MusicPracticeLog } from "../../domain/entities/music-practice-log.entity";

export class MusicPracticeLogResponseDto {
  id!: string;
  organizationId!: string;
  studentId!: string;
  date!: Date;
  minutes!: number;
  instrument?: string;
  piece?: string;
  notes?: string;
  teacherFeedback?: string;
  rating?: number;

  static fromDomain(log: MusicPracticeLog): MusicPracticeLogResponseDto {
    const dto = new MusicPracticeLogResponseDto();
    dto.id = log.id;
    dto.organizationId = log.organizationId;
    dto.studentId = log.studentId;
    dto.date = log.date;
    dto.minutes = log.minutes;
    dto.instrument = log.instrument;
    dto.piece = log.piece;
    dto.notes = log.notes;
    dto.teacherFeedback = log.teacherFeedback;
    dto.rating = log.rating;
    return dto;
  }

  static fromDomainList(logs: MusicPracticeLog[]): MusicPracticeLogResponseDto[] {
    return logs.map((log) => MusicPracticeLogResponseDto.fromDomain(log));
  }
}
