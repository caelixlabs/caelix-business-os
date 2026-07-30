import { Inject, Injectable } from "@nestjs/common";
import type { OrganizationRepository } from "../../domain/repositories/organization.repository";
import { CreateOrganizationCommand } from "./create-organization.command";
import { Organization } from "../../domain/entities/organization.entity";
import { GetOrganizationQuery } from "../get-organization/get-organization.query";
import { customUUID } from '../../../../kernel/utility/uuid';
import { EntityNotFoundException, ConflictException } from "@/common/framework/exceptions";
import { ORGANIZATION_REPOSITORY } from "../../domain/repositories";

@Injectable()
export class CreateOrganizationHandler {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly repository: OrganizationRepository,
  ) { }

  async execute(command: CreateOrganizationCommand) {
    const { name, slug, description } = command.dto;
    const exists = await this.repository.findBySlug(slug);

    if (exists) {
      throw new ConflictException(
        `Organization '${slug}' already exists`,
      );
    }
    const organization = Organization.create({
      id: customUUID.generate(),
      name,
      slug,
      description,
    });
    console.log("organization creation log", organization);
    return this.repository.create(organization);
  }
}

@Injectable()
export class GetOrganizationHandler {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly repository: OrganizationRepository,
  ) { }

  async execute(command: GetOrganizationQuery) {
    const organization = await this.repository.findById(command.id);

    if (!organization) {
      throw new EntityNotFoundException(
        'Organization',
        command.id,
      );
    }

    return organization;
  }
}

@Injectable()
export class GetOrganizationsHandler {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly repository: OrganizationRepository,
  ) { }

  execute() {
    return this.repository.findAll();
  }
}