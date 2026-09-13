import { MusicAttendance } from "../../domain/entities/music-attendance.entity";

export class MusicAttendanceResponseDto {
  id!: string;
  organizationId!: string;
  studentId!: string;
  batchId!: string;
  date!: Date;
  status!: string;
  notes?: string;

  static fromDomain(attendance: MusicAttendance): MusicAttendanceResponseDto {
    const dto = new MusicAttendanceResponseDto();
    dto.id = attendance.id;
    dto.organizationId = attendance.organizationId;
    dto.studentId = attendance.studentId;
    dto.batchId = attendance.batchId;
    dto.date = attendance.date;
    dto.status = attendance.status;
    dto.notes = attendance.notes;
    return dto;
  }

  static fromDomainList(records: MusicAttendance[]): MusicAttendanceResponseDto[] {
    return records.map((record) => MusicAttendanceResponseDto.fromDomain(record));
  }
}
