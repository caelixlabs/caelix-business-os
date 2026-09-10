import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/prisma";
import { ContactMapper } from "./contact.mapper";
import { Contact } from "../../domain/entities/contact.entity";
import { ContactRepository } from "../../domain/repositories";

@Injectable()
export class ContactPrismaRepository implements ContactRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(contact: Contact): Promise<Contact> {
    const model = await this.prisma.client.contact.create({
      data: ContactMapper.toPersistence(contact),
    });

    return ContactMapper.toDomain(model);
  }

  async findById(organizationId: string, id: string): Promise<Contact | null> {
    const model = await this.prisma.client.contact.findFirst({
      where: {
        id,
        organizationId,
      },
    });

    return model ? ContactMapper.toDomain(model) : null;
  }

  async findByEmail(
    organizationId: string,
    email: string
  ): Promise<Contact | null> {
    const model = await this.prisma.client.contact.findFirst({
      where: {
        organizationId,
        email,
      },
    });

    return model ? ContactMapper.toDomain(model) : null;
  }

  async findByPhone(
    organizationId: string,
    phone: string
  ): Promise<Contact | null> {
    const model = await this.prisma.client.contact.findFirst({
      where: {
        organizationId,
        phone,
      },
    });

    return model ? ContactMapper.toDomain(model) : null;
  }

  async findByOrganization(organizationId: string): Promise<Contact[]> {
    const rows = await this.prisma.client.contact.findMany({
      where: {
        organizationId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return rows.map(ContactMapper.toDomain);
  }

  async update(contact: Contact): Promise<Contact> {
    const model = await this.prisma.client.contact.update({
      where: {
        id: contact.id,
      },
      data: ContactMapper.toPersistence(contact),
    });

    return ContactMapper.toDomain(model);
  }

  async delete(organizationId: string, id: string): Promise<void> {
    await this.prisma.client.contact.delete({
      where: { 
        organizationId,
        id,
      },
    });
  }
}
