import { Contact } from "../../domain/entities/contact.entity";

export class ContactResponseDto {
  id!: string;
  organizationId!: string;
  branchId?: string;
  type!: string;
  status!: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  email?: string;
  phone?: string;
  notes?: string;

  static fromDomain(contact: Contact): ContactResponseDto {
    const dto = new ContactResponseDto();
    dto.id = contact.id;
    dto.organizationId = contact.organizationId;
    dto.branchId = contact.branchId;
    dto.type = contact.type;
    dto.status = contact.status;
    dto.firstName = contact.firstName;
    dto.lastName = contact.lastName;
    dto.companyName = contact.companyName;
    dto.email = contact.email;
    dto.phone = contact.phone;
    dto.notes = contact.notes;
    return dto;
  }

  static fromDomainList(contacts: Contact[]): ContactResponseDto[] {
    return contacts.map((contact) => ContactResponseDto.fromDomain(contact));
  }
}
