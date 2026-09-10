import {
  Enquiry as PrismaEnquiry,
  EnquirySource as PrismaEnquirySource,
  EnquiryStatus as PrismaEnquiryStatus,
} from "@caelix-business-os/database";

import { Enquiry } from "../../domain/entities/enquiry.entity";

import { EnquirySource, EnquiryStatus } from "../../domain/enums";

export class EnquiryMapper {
  static toDomain(model: PrismaEnquiry): Enquiry {
    return new Enquiry(
      model.id,
      model.organizationId,
      model.branchId ?? undefined,
      model.contactId,
      model.assignedUserId ?? undefined,
      model.source as EnquirySource,
      model.subject,
      model.description ?? undefined,
      model.status as EnquiryStatus
    );
  }

  static toPersistence(enquiry: Enquiry) {
    return {
      id: enquiry.id,
      organizationId: enquiry.organizationId,
      branchId: enquiry.branchId ?? null,
      contactId: enquiry.contactId,
      assignedUserId: enquiry.assignedUserId ?? null,
      source: enquiry.source as PrismaEnquirySource,
      status: enquiry.status as PrismaEnquiryStatus,
      subject: enquiry.subject,
      description: enquiry.description ?? null,
    };
  }
}
