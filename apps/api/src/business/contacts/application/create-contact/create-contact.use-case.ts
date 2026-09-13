import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { CONTACT_REPOSITORY } from "../../domain/repositories";
import { customUUID } from "@/kernel/utility/uuid";
import { CreateContactDto } from "../dto/create-contact.dto";
import { Contact } from "../../domain/entities/contact.entity";
import { ContactPrismaRepository } from "../../infrastructure/prisma/contact.prisma.repository";

@Injectable()
export class CreateContactUseCase {
  constructor(
    @Inject(CONTACT_REPOSITORY)
    private readonly repository: ContactPrismaRepository
  ) {}

  async execute(organizationId: string, dto: CreateContactDto): Promise<Contact> {
    if (dto.email) {
      const existing = await this.repository.findByEmail(
        organizationId,
        dto.email
      );

      if (existing) {
        throw new BadRequestException(
          "A contact with this email already exists."
        );
      }
    }

    const contact = Contact.create({
      id: customUUID.generate(),
      organizationId,
      branchId: dto.branchId,
      type: dto.type,
      firstName: dto.firstName,
      lastName: dto.lastName,
      companyName: dto.companyName,
      email: dto.email,
      phone: dto.phone,
      notes: dto.notes,
    });

    return this.repository.create(contact);
  }
}
