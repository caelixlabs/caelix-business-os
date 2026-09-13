import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

import { MusicAttendanceStatus } from "../../domain/enums/music-attendance.enum";

export class MarkMusicAttendanceDto {
  @IsString()
  @IsNotEmpty()
  studentId!: string;

  @IsString()
  @IsNotEmpty()
  batchId!: string;

  @IsDateString()
  date!: string;

  @IsEnum(MusicAttendanceStatus)
  status!: MusicAttendanceStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
