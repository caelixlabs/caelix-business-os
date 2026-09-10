import { Inject, Injectable } from "@nestjs/common";

import { EntityNotFoundException } from "@/common/framework/exceptions";

import { GetEnquiryQuery } from "./get-enquiry.query";
import { ENQUIRY_REPOSITORY, type EnquiryRepository } from "../../domain";

@Injectable()
export class GetEnquiryHandler {
  constructor(
    @Inject(ENQUIRY_REPOSITORY)
    private readonly repository: EnquiryRepository
  ) {}

  async execute(query: GetEnquiryQuery) {
    const enquiry = await this.repository.findByIdForOrganization(
      query.organizationId,
      query.enquiryId
    );

    if (!enquiry) {
      throw new EntityNotFoundException("Enquiry", query.enquiryId);
    }

    return enquiry;
  }
}
