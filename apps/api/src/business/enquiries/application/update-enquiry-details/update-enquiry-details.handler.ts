import { Inject, Injectable } from "@nestjs/common";

import { EntityNotFoundException } from "@/common/framework/exceptions";

import { ENQUIRY_REPOSITORY, type EnquiryRepository } from "../../domain";

import { UpdateEnquiryDetailsDto } from "./update-enquiry-details.dto";

@Injectable()
export class UpdateEnquiryDetailsHandler {
  constructor(
    @Inject(ENQUIRY_REPOSITORY)
    private readonly repository: EnquiryRepository
  ) {}

  async execute(organizationId: string, enquiryId: string, dto: UpdateEnquiryDetailsDto) {
    const enquiry = await this.repository.findByIdForOrganization(organizationId, enquiryId);

    if (!enquiry) {
      throw new EntityNotFoundException("Enquiry", enquiryId);
    }

    enquiry.updateDetails(dto);

    return this.repository.update(enquiry);
  }
}
