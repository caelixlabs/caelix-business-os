import { Inject, Injectable } from "@nestjs/common";

import { EntityNotFoundException } from "@/common/framework/exceptions";

import { CONTACT_REPOSITORY } from "../../domain/repositories";
import type { ContactRepository } from "../../domain/repositories";

@Injectable()
export class ArchiveContactHandler {
  constructor(
    @Inject(CONTACT_REPOSITORY)
    private readonly repository: ContactRepository
  ) {}

  async execute(organizationId: string, id: string) {
    const contact = await this.repository.findById(organizationId, id);

    if (!contact) {
      throw new EntityNotFoundException("Contact", id);
    }

    contact.archive();

    return this.repository.update(contact);
  }
}
