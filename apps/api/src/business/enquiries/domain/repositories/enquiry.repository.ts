import { Repository } from "@/common/ddd";

import { Enquiry } from "../entities/enquiry.entity";

export interface EnquiryRepository extends Repository<Enquiry> {
  findByOrganization(organizationId: string): Promise<Enquiry[]>;

  findByBranch(organizationId: string, branchId: string): Promise<Enquiry[]>;

  findByContact(organizationId: string, contactId: string): Promise<Enquiry[]>;

  findByIdForOrganization(organizationId: string,enquiryId: string): Promise<Enquiry | null>;
}
