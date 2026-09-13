import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Min,
} from "class-validator";

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

export class CreateMusicBatchDto {
  @IsString()
  @IsNotEmpty()
  branchId!: string;

  @IsString()
  @IsNotEmpty()
  courseId!: string;

  @IsOptional()
  @IsString()
  teacherUserId?: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  @IsDateString()
  startDate!: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  days!: string[];

  @Matches(TIME_PATTERN, { message: "startTime must be in HH:mm format" })
  startTime!: string;

  @Matches(TIME_PATTERN, { message: "endTime must be in HH:mm format" })
  endTime!: string;
}
