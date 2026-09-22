import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, type MessageTemplate } from "@caelix-business-os/database";

import { PrismaService } from "@/common/prisma";
import { customUUID } from "@/kernel/utility/uuid";

import { CreateTemplateDto, UpdateTemplateDto } from "./dto/communication.dto";

@Injectable()
export class TemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  list(organizationId: string): Promise<MessageTemplate[]> {
    return this.prisma.client.messageTemplate.findMany({ where: { organizationId }, orderBy: { name: "asc" } });
  }

  async create(organizationId: string, dto: CreateTemplateDto): Promise<MessageTemplate> {
    try {
      return await this.prisma.client.messageTemplate.create({ data: { id: customUUID.generate(), organizationId, ...dto } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new ConflictException("A template with that name already exists.");
      }
      throw error;
    }
  }

  async update(organizationId: string, id: string, dto: UpdateTemplateDto): Promise<MessageTemplate> {
    const { count } = await this.prisma.client.messageTemplate.updateMany({ where: { id, organizationId }, data: dto });
    if (count === 0) throw new NotFoundException("Template not found.");
    return this.prisma.client.messageTemplate.findUniqueOrThrow({ where: { id } });
  }

  async remove(organizationId: string, id: string): Promise<void> {
    const { count } = await this.prisma.client.messageTemplate.deleteMany({ where: { id, organizationId } });
    if (count === 0) throw new NotFoundException("Template not found.");
  }
}
