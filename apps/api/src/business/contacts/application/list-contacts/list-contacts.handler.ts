import { Inject, Injectable } from "@nestjs/common";

import { CONTACT_REPOSITORY } from "../../domain/repositories";
import type { ContactRepository } from "../../domain/repositories";

import { ListContactsQuery } from "./list-contacts.query";

@Injectable()
export class ListContactsHandler {
  constructor(
    @Inject(CONTACT_REPOSITORY)
    private readonly repository: ContactRepository
  ) {}

  execute(query: ListContactsQuery) {
    return this.repository.findByOrganization(query.organizationId);
  }
}
