import { Contact } from "../entities/contact.entity";

export interface ContactRepository {
  create(contact: Contact): Promise<Contact>;

  findById(organizationId: string, id: string): Promise<Contact | null>;

  findByEmail(organizationId: string, email: string): Promise<Contact | null>;

  findByPhone(organizationId: string, phone: string): Promise<Contact | null>;

  findByOrganization(organizationId: string): Promise<Contact[]>;

  update(contact: Contact): Promise<Contact>;

  delete(organizationId: string, id: string): Promise<void>;
}
