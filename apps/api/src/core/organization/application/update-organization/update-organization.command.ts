import { UpdateOrganizationDto } from './update-organization.dto';

export class UpdateOrganizationCommand {
  constructor(
    public readonly id: string,
    public readonly dto: UpdateOrganizationDto,
  ) {}
}