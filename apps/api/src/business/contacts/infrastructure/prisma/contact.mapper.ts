import {
  Contact as PrismaContact,
  ContactStatus as PrismaContactStatus,
  ContactType as PrismaContactType,
} from "@caelix-business-os/database";
import { Contact } from "../../domain/entities/contact.entity";
import { ContactType } from "../../domain/enums";

export class ContactMapper {
  static toDomain(model: PrismaContact): Contact {
    const contact = Contact.create({
      id: model.id,
      organizationId: model.organizationId,
      branchId: model.branchId ?? undefined,
      type: model.type as ContactType,
      firstName: model.firstName ?? undefined,
      lastName: model.lastName ?? undefined,
      companyName: model.companyName ?? undefined,
      email: model.email ?? undefined,
      phone: model.phone ?? undefined,
      notes: model.notes ?? undefined,
    });

    if (model.status === PrismaContactStatus.ARCHIVED) {
      contact.archive();
    }

    if (model.status === PrismaContactStatus.INACTIVE) {
      contact.deactivate();
    }

    return contact;
  }

  static toPersistence(contact: Contact) {
    return {
      id: contact.id,
      organizationId: contact.organizationId,
      branchId: contact.branchId ?? null,
      type: contact.type as PrismaContactType,
      status: contact.status as PrismaContactStatus,
      firstName: contact.firstName ?? null,
      lastName: contact.lastName ?? null,
      companyName: contact.companyName ?? null,
      email: contact.email ?? null,
      phone: contact.phone ?? null,
      notes: contact.notes ?? null,
    };
  }
}
