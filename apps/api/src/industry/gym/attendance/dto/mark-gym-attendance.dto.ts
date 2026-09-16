import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { AttendanceStatus } from "@caelix-business-os/database";

export class MarkGymAttendanceDto {
  @IsString()
  @IsNotEmpty()
  memberId!: string;

  @IsString()
  @IsNotEmpty()
  classId!: string;

  @IsDateString()
  date!: string;

  @IsEnum(AttendanceStatus)
  status!: AttendanceStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
