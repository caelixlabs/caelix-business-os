import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { OrganizationRepository } from "../../domain/repositories/organization.repository";
import { CreateOrganizationCommand } from "./create-organization.command";
import { Organization } from "../../domain/entities/organization.entity";
import { GetOrganizationQuery } from "../get-organization/get-organization.query";
import { customUUID } from '../../../../kernel/utility/uuid';

@Injectable()
export class CreateOrganizationHandler {
  constructor(
    private readonly repository: OrganizationRepository,
  ) {}

  async execute(command: CreateOrganizationCommand) {
    const { name, slug, description } = command.dto;
    const exists = await this.repository.findBySlug(slug);

    if (exists) {
      throw new ConflictException(
        `Organization '${slug}' already exists`,
      );
    }
    const organization = new Organization(
      customUUID.generate(),
      name,
      slug,
      description,
    );
    console.log("organization", organization);
    return this.repository.create(organization);
  }
}

@Injectable()
export class GetOrganizationHandler {
  constructor(
    private readonly repository: OrganizationRepository,
  ) {}

  async execute(query: GetOrganizationQuery) {
    const organization = await this.repository.findById(query.id);
    
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }
}

@Injectable()
export class GetOrganizationsHandler {
  constructor(
    private readonly repository: OrganizationRepository,
  ) {}

  execute() {
    return this.repository.findAll();
  }
}