import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

import { MusicSkillLevel } from "../../domain/enums/music-skill.enum";

export class CreateMusicCourseDto {
  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

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
}
