import { Inject, Injectable } from "@nestjs/common";
import { ENQUIRY_REPOSITORY, type EnquiryRepository } from "../../domain";
import { ListEnquiriesQuery } from "./list-enquiries.query";

@Injectable()
export class ListEnquiriesHandler {
  constructor(
    @Inject(ENQUIRY_REPOSITORY)
    private readonly repository: EnquiryRepository
  ) {}

  async execute(query: ListEnquiriesQuery) {
    if (query.branchId) {
      return this.repository.findByBranch(query.organizationId, query.branchId);
    }

    if (query.contactId) {
      return this.repository.findByContact(
        query.organizationId,
        query.contactId
      );
    }

    return this.repository.findByOrganization(query.organizationId);
  }
}
