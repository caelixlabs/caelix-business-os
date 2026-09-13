import { Enquiry } from "../../domain/entities/enquiry.entity";

export class EnquiryResponseDto {
  id!: string;
  organizationId!: string;
  branchId?: string;
  contactId!: string;
  assignedUserId?: string;
  source!: string;
  subject!: string;
  description?: string;
  status!: string;

  static fromDomain(enquiry: Enquiry): EnquiryResponseDto {
    const dto = new EnquiryResponseDto();
    dto.id = enquiry.id;
    dto.organizationId = enquiry.organizationId;
    dto.branchId = enquiry.branchId;
    dto.contactId = enquiry.contactId;
    dto.assignedUserId = enquiry.assignedUserId;
    dto.source = enquiry.source;
    dto.subject = enquiry.subject;
    dto.description = enquiry.description;
    dto.status = enquiry.status;
    return dto;
  }

  static fromDomainList(enquiries: Enquiry[]): EnquiryResponseDto[] {
    return enquiries.map((enquiry) => EnquiryResponseDto.fromDomain(enquiry));
  }
}
