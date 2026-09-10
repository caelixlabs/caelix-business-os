import { Module } from '@nestjs/common';

import { SETTINGS_REPOSITORY } from './domain/repositories';
import { SettingsPrismaRepository } from './infrastructure/prisma/settings.prisma.repository';
import { SettingsController } from './presentation/controllers/settings.controller';
import { GetSettingsHandler } from './application/get-settings/get-settings.handler';
import { UpdateSettingsHandler } from './application/update-settings/update-settings.handler';

@Module({
  controllers: [SettingsController],
  providers: [
    GetSettingsHandler,
    UpdateSettingsHandler,
    {
      provide: SETTINGS_REPOSITORY,
      useClass: SettingsPrismaRepository,
    },
  ],
  exports: [SETTINGS_REPOSITORY],
})
export class SettingsModule {}