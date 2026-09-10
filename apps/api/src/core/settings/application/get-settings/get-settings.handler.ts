import { Inject, Injectable } from '@nestjs/common';
import { SETTINGS_REPOSITORY } from '../../domain/repositories';
import type { SettingsRepository } from '../../domain/repositories';
import { SETTING_DEFAULTS } from '../../domain/enums';
import { GetSettingsQuery } from './get-settings.query';

@Injectable()
export class GetSettingsHandler {
  constructor(
    @Inject(SETTINGS_REPOSITORY) private readonly repository: SettingsRepository,
  ) {}

  async execute(query: GetSettingsQuery) {
    const stored = await this.repository.getAll(query.organizationId);
    // Any key never explicitly set falls back to its default, so the
    // caller always gets a complete map.
    return { ...SETTING_DEFAULTS, ...stored };
  }
}