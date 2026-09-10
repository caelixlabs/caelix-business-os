import { Inject, Injectable } from '@nestjs/common';
import { SETTINGS_REPOSITORY } from '../../domain/repositories';
import type { SettingsRepository } from '../../domain/repositories';
import { SETTING_DEFAULTS } from '../../domain/enums';
import { UpdateSettingsCommand } from './update-settings.command';

@Injectable()
export class UpdateSettingsHandler {
  constructor(
    @Inject(SETTINGS_REPOSITORY) private readonly repository: SettingsRepository,
  ) {}

  async execute(command: UpdateSettingsCommand) {
    const values = command.dto.toSettingsMap();
    await this.repository.setMany(command.organizationId, values);

    const stored = await this.repository.getAll(command.organizationId);
    return { ...SETTING_DEFAULTS, ...stored };
  }
}