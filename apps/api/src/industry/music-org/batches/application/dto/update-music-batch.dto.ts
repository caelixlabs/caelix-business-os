import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Min,
} from "class-validator";

import { MusicBatchStatus } from "../../domain/enums/music-batch-status.enum";

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

export class UpdateMusicBatchDto {
  @IsOptional()
  @IsString()
  teacherUserId?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  days?: string[];

  @IsOptional()
  @Matches(TIME_PATTERN, { message: "startTime must be in HH:mm format" })
  startTime?: string;

  @IsOptional()
  @Matches(TIME_PATTERN, { message: "endTime must be in HH:mm format" })
  endTime?: string;

  @IsOptional()
  @IsEnum(MusicBatchStatus)
  status?: MusicBatchStatus;
}
