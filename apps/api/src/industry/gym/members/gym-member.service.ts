import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { ContactType, GymMemberStatus } from "@caelix-business-os/database";

import { PrismaService } from "@/common/prisma";
import { customUUID } from "@/kernel/utility/uuid";

export interface CreateGymMemberInput {
  branchId?: string;
  memberNo: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  notes?: string;
}

export interface UpdateGymMemberInput {
  branchId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  status?: GymMemberStatus;
  notes?: string;
}

const WITH_CONTACT = { include: { contact: true } } as const;

@Injectable()
export class GymMemberService {
  constructor(private readonly prisma: PrismaService) {}

  async create(organizationId: string, input: CreateGymMemberInput) {
    const existing = await this.prisma.client.gymMember.findFirst({
      where: { organizationId, memberNo: input.memberNo },
    });

    if (existing) {
      throw new ConflictException(`Member number '${input.memberNo}' already exists.`);
    }

    return this.prisma.client.$transaction(async (tx) => {
      const contact = await tx.contact.create({
        data: {
          id: customUUID.generate(),
          organizationId,
          branchId: input.branchId,
          type: ContactType.PERSON,
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phone: input.phone,
        },
      });

      return tx.gymMember.create({
        data: {
          id: customUUID.generate(),
          organizationId,
          branchId: input.branchId,
          contactId: contact.id,
          memberNo: input.memberNo,
          notes: input.notes,
        },
        ...WITH_CONTACT,
      });
    });
  }

  list(organizationId: string) {
    return this.prisma.client.gymMember.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      ...WITH_CONTACT,
    });
  }

  private async findOwned(organizationId: string, id: string) {
    const member = await this.prisma.client.gymMember.findFirst({
      where: { id, organizationId },
      ...WITH_CONTACT,
    });

    if (!member) {
      throw new NotFoundException("Gym member not found.");
    }

    return member;
  }

  async get(organizationId: string, id: string) {
    return this.findOwned(organizationId, id);
  }

  async update(organizationId: string, id: string, input: UpdateGymMemberInput) {
    const existing = await this.findOwned(organizationId, id);

    return this.prisma.client.$transaction(async (tx) => {
      await tx.contact.update({
        where: { id: existing.contactId },
        data: {
          branchId: input.branchId ?? existing.branchId,
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phone: input.phone,
        },
      });

      return tx.gymMember.update({
        where: { id: existing.id },
        data: {
          branchId: input.branchId,
          status: input.status,
          notes: input.notes,
        },
        ...WITH_CONTACT,
      });
    });
  }
}
