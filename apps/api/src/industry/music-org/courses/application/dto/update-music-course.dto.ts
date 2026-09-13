import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

import { MusicSkillLevel } from "../../domain/enums/music-skill.enum";
import { MusicCourseStatus } from "../../domain/enums/music-course.enum";

export class UpdateMusicCourseDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  instrument?: string;

  @IsOptional()
  @IsEnum(MusicSkillLevel)
  skillLevel?: MusicSkillLevel;

  @IsOptional()
  @IsInt()
  @Min(1)
  durationWeeks?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  classDurationMinutes?: number;

  @IsOptional()
  @IsEnum(MusicCourseStatus)
  status?: MusicCourseStatus;
}
