import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/common/prisma';
import { customUUID } from '@/kernel/utility/uuid';

import { SettingsMap, SettingsRepository } from '../../domain/repositories/settings.repository';
import { SettingKey } from '../../domain/enums';

@Injectable()
export class SettingsPrismaRepository implements SettingsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(organizationId: string): Promise<SettingsMap> {
    const rows = await this.prisma.client.organizationSetting.findMany({
      where: { organizationId },
    });

    const result: SettingsMap = {};
    for (const row of rows as Array<{ key: string; value: unknown }>) {
      if (Object.values(SettingKey).includes(row.key as SettingKey)) {
        result[row.key as SettingKey] = String(row.value);
      }
    }
    return result;
  }

  async setMany(organizationId: string, values: SettingsMap): Promise<void> {
    const entries = Object.entries(values) as [SettingKey, string][];

    await this.prisma.client.$transaction(
      entries.map(([key, value]) =>
        this.prisma.client.organizationSetting.upsert({
          where: { organizationId_key: { organizationId, key } },
          create: { id: customUUID.generate(), organizationId, key, value },
          update: { value },
        }),
      ),
    );
  }
}