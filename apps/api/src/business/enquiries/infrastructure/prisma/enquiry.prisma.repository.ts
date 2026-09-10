import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/prisma";
import { PrismaRepository } from "@/common/prisma/prisma.repository";
import { EventBus } from "@/common/ddd";
import { Enquiry, EnquiryRepository } from "../../domain";
import { EnquiryMapper } from "./enquiry.mapper";

@Injectable()
export class EnquiryPrismaRepository
  extends PrismaRepository
  implements EnquiryRepository
{
  constructor(prisma: PrismaService, eventBus: EventBus) {
    super(prisma, eventBus);
  }

  async create(entity: Enquiry): Promise<Enquiry> {
    const model = await this.runInTransaction(entity, "Enquiry", (tx) =>
      tx.enquiry.create({
        data: EnquiryMapper.toPersistence(entity),
      })
    );

    return EnquiryMapper.toDomain(model);
  }

  async findById(id: string): Promise<Enquiry | null> {
    const model = await this.prisma.client.enquiry.findUnique({
      where: { id },
    });

    return model ? EnquiryMapper.toDomain(model) : null;
  }

  async findByIdForOrganization(
    organizationId: string,
    enquiryId: string
  ): Promise<Enquiry | null> {
    const model = await this.prisma.client.enquiry.findFirst({
      where: {
        id: enquiryId,
        organizationId,
      },
    });

    return model ? EnquiryMapper.toDomain(model) : null;
  }

  async findByOrganization(organizationId: string): Promise<Enquiry[]> {
    const rows = await this.prisma.client.enquiry.findMany({
      where: {
        organizationId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return rows.map(EnquiryMapper.toDomain);
  }

  async findByBranch(
    organizationId: string,
    branchId: string
  ): Promise<Enquiry[]> {
    const rows = await this.prisma.client.enquiry.findMany({
      where: {
        organizationId,
        branchId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return rows.map(EnquiryMapper.toDomain);
  }

  async findByContact(
    organizationId: string,
    contactId: string
  ): Promise<Enquiry[]> {
    const rows = await this.prisma.client.enquiry.findMany({
      where: {
        organizationId,
        contactId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return rows.map(EnquiryMapper.toDomain);
  }

  async findAll(): Promise<Enquiry[]> {
    const rows = await this.prisma.client.enquiry.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return rows.map(EnquiryMapper.toDomain);
  }

  async update(entity: Enquiry): Promise<Enquiry> {
    const model = await this.runInTransaction(entity, "Enquiry", (tx) =>
      tx.enquiry.update({
        where: {
          id: entity.id,
        },
        data: EnquiryMapper.toPersistence(entity),
      })
    );

    return EnquiryMapper.toDomain(model);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.client.enquiry.delete({
      where: { id },
    });
  }
}
