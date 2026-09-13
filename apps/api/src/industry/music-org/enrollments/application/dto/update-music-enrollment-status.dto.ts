import { IsEnum, IsNotEmpty } from "class-validator";

import { MusicEnrollmentStatus } from "../../domain/enums/music-enrollment.enum";

export class UpdateMusicEnrollmentStatusDto {
  @IsEnum(MusicEnrollmentStatus)
  @IsNotEmpty()
  status!: MusicEnrollmentStatus;
}
