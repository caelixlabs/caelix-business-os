import { Inject, Injectable } from "@nestjs/common";

import { EntityNotFoundException } from "@/common/framework/exceptions";

import { ENQUIRY_REPOSITORY, type EnquiryRepository } from "../../domain";

import { AssignEnquiryDto } from "./assign-enquiry.dto";

@Injectable()
export class AssignEnquiryHandler {
  constructor(
    @Inject(ENQUIRY_REPOSITORY)
    private readonly repository: EnquiryRepository
  ) {}

  async execute(organizationId: string, enquiryId: string, dto: AssignEnquiryDto) {
    const enquiry = await this.repository.findByIdForOrganization(organizationId, enquiryId);

    if (!enquiry) {
      throw new EntityNotFoundException("Enquiry", enquiryId);
    }

    enquiry.assignTo(dto.userId);

    return this.repository.update(enquiry);
  }
}
