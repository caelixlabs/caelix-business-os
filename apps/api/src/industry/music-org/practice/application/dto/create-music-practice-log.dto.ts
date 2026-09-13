import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

export class CreateMusicPracticeLogDto {
  @IsString()
  @IsNotEmpty()
  studentId!: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsInt()
  @Min(0)
  minutes!: number;

  @IsOptional()
  @IsString()
  instrument?: string;

  @IsOptional()
  @IsString()
  piece?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  teacherFeedback?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;
}
