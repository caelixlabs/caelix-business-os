import { CreateOrganizationDto } from './create-organization.dto';

export class CreateOrganizationCommand {
  constructor(public readonly dto: CreateOrganizationDto) {}
}
