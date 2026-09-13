import { Inject, Injectable } from "@nestjs/common";

import { EntityNotFoundException } from "@/common/framework/exceptions";

import { CONTACT_REPOSITORY } from "../../domain/repositories";
import type { ContactRepository } from "../../domain/repositories";

import { GetContactQuery } from "./get-contact.query";

@Injectable()
export class GetContactHandler {
  constructor(
    @Inject(CONTACT_REPOSITORY)
    private readonly repository: ContactRepository
  ) {}

  async execute(query: GetContactQuery) {
    const contact = await this.repository.findById(query.organizationId, query.id);

    if (!contact) {
      throw new EntityNotFoundException("Contact", query.id);
    }

    return contact;
  }
}
