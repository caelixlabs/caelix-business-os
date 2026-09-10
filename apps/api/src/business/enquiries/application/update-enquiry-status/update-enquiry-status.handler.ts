import { Inject, Injectable } from "@nestjs/common";
import { EntityNotFoundException } from "@/common/framework/exceptions";
import { ENQUIRY_REPOSITORY, type EnquiryRepository } from "../../domain";
import { EnquiryStatus } from "../../domain/enums";
import { UpdateEnquiryStatusDto } from "./update-enquiry-status.dto";


@Injectable()
export class UpdateEnquiryStatusHandler {
  constructor(
    @Inject(ENQUIRY_REPOSITORY)
    private readonly repository: EnquiryRepository
  ) {}

  async execute(
    organizationId: string,
    enquiryId: string,
    dto: UpdateEnquiryStatusDto
  ) {
    const enquiry = await this.repository.findByIdForOrganization(
      organizationId,
      enquiryId
    );

    if (!enquiry) {
      throw new EntityNotFoundException("Enquiry", enquiryId);
    }

    switch (dto.status) {
      case EnquiryStatus.CONTACTED:
        enquiry.contact();
        break;

      case EnquiryStatus.QUALIFIED:
        enquiry.qualify();
        break;

      case EnquiryStatus.CONVERTED:
        enquiry.convert();
        break;

      case EnquiryStatus.LOST:
        enquiry.lose();
        break;

      default:
        throw new Error(`Unsupported enquiry transition: ${dto.status}`);
    }

    return this.repository.update(enquiry);
  }
}
