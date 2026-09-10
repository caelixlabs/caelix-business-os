import { IsEnum } from 'class-validator';

import { UserStatus } from '../../domain/enum';

export class UpdateUserStatusDto {
  @IsEnum(UserStatus)
  status!: UserStatus;
}