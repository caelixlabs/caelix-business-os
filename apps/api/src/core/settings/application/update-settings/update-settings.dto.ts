import { IsIn, IsOptional, IsString } from 'class-validator';
import { SettingKey } from '../../domain/enums';

export class UpdateSettingsDto {
  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  dateFormat?: string;

  @IsOptional()
  @IsIn(['sunday', 'monday'])
  weekStart?: string;

  toSettingsMap(): Partial<Record<SettingKey, string>> {
    const map: Partial<Record<SettingKey, string>> = {};
    if (this.timezone !== undefined) map[SettingKey.TIMEZONE] = this.timezone;
    if (this.currency !== undefined) map[SettingKey.CURRENCY] = this.currency;
    if (this.dateFormat !== undefined) map[SettingKey.DATE_FORMAT] = this.dateFormat;
    if (this.weekStart !== undefined) map[SettingKey.WEEK_START] = this.weekStart;
    return map;
  }
}