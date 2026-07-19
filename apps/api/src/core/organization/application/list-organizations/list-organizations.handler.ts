import { Injectable } from "@nestjs/common";
import { OrganizationRepository } from "../../domain/repositories/organization.repository";
import { ListOrganizationsQuery } from "./list-organizations.query";

@Injectable()
export class ListOrganizationsHandler {
  constructor(
    private readonly repository: OrganizationRepository,
  ) {}

  async execute(_: ListOrganizationsQuery) {
    console.log("ID", _);
    return this.repository.findAll();
  }
}