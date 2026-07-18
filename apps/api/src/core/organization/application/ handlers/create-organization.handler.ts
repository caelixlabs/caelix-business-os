import { Injectable } from "@nestjs/common";
import { OrganizationRepository } from "../../domain/repositories/organization.repository";
import { CreateOrganizationCommand } from "../commands/create-organization.command";

@Injectable()
export class CreateOrganizationHandler {
  constructor(
    private readonly repository: OrganizationRepository,
  ) {}

  async execute(
    command: CreateOrganizationCommand,
  ) {
    throw new Error('Not implemented');
  }
}