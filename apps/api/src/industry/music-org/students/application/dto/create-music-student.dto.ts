import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

import { MusicSkillLevel } from "@/industry/music-org/courses/domain/enums/music-skill.enum";

export class CreateMusicStudentDto {
  @IsString()
  @IsNotEmpty()
  studentNo!: string;

  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsOptional()
  @IsString()
  branchId?: string;

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
  @IsString()
  notes?: string;
}
