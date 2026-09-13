import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from "class-validator";

import { MusicSkillLevel } from "@/industry/music-org/courses/domain/enums/music-skill.enum";
import { MusicStudentStatus } from "../../domain/enums/music-student.enum";

export class UpdateMusicStudentDto {
  @IsOptional()
  @IsString()
  branchId?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  guardianName?: string;

  @IsOptional()
  @IsString()
  guardianPhone?: string;

  @IsOptional()
  @IsEmail()
  guardianEmail?: string;

  @IsOptional()
  @IsString()
  instrument?: string;

  @IsOptional()
  @IsEnum(MusicSkillLevel)
  skillLevel?: MusicSkillLevel;

  @IsOptional()
  @IsEnum(MusicStudentStatus)
  status?: MusicStudentStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
