import { UpdateSettingsDto } from './update-settings.dto';

export class UpdateSettingsCommand {
  constructor(
    public readonly organizationId: string,
    public readonly dto: UpdateSettingsDto,
  ) {}
}