import { Inject, Injectable } from "@nestjs/common";

import { EntityNotFoundException } from "@/common/framework/exceptions";

import { CONTACT_REPOSITORY } from "../../domain/repositories";
import type { ContactRepository } from "../../domain/repositories";

import { UpdateContactDto } from "./update-contact.dto";

@Injectable()
export class UpdateContactHandler {
  constructor(
    @Inject(CONTACT_REPOSITORY)
    private readonly repository: ContactRepository
  ) {}

  async execute(organizationId: string, id: string, dto: UpdateContactDto) {
    const contact = await this.repository.findById(organizationId, id);

    if (!contact) {
      throw new EntityNotFoundException("Contact", id);
    }

    contact.updateDetails(dto);

    return this.repository.update(contact);
  }
}
