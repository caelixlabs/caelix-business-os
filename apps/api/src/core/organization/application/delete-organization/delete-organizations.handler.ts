import { Injectable, NotFoundException } from "@nestjs/common";
import { OrganizationRepository } from "../../domain/repositories/organization.repository";
import { DeleteOrganizationCommand } from "./delete-organizations.command";

@Injectable()
export class DeleteOrganizationHandler {
  constructor(
    private readonly repository: OrganizationRepository,
  ) {}

  async execute(command: DeleteOrganizationCommand) {
    const organization = await this.repository.findById(command.id);

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    await this.repository.delete(command.id);
  }
}