import { Inject, Injectable } from "@nestjs/common";
import { customUUID } from "@/kernel/utility/uuid";
import { Enquiry } from "../../domain/entities/enquiry.entity";
import { ENQUIRY_REPOSITORY, type EnquiryRepository } from "../../domain";

import { CreateEnquiryDto } from "./create-enquiry.dto";

@Injectable()
export class CreateEnquiryHandler {
  constructor(
    @Inject(ENQUIRY_REPOSITORY)
    private readonly repository: EnquiryRepository
  ) {}

  async execute(dto: CreateEnquiryDto): Promise<Enquiry> {
    const enquiry = Enquiry.create({
      id: customUUID.generate(),
      organizationId: dto.organizationId,
      branchId: dto.branchId,
      contactId: dto.contactId,
      assignedUserId: dto.assignedUserId,
      source: dto.source,
      subject: dto.subject,
      description: dto.description,
    });

    return this.repository.create(enquiry);
  }
}
