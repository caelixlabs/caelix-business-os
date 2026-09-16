import { Injectable, NotFoundException } from "@nestjs/common";
import type { GymClass, GymClassStatus } from "@caelix-business-os/database";

import { PrismaService } from "@/common/prisma";
import { customUUID } from "@/kernel/utility/uuid";

export interface CreateGymClassInput {
  branchId: string;
  trainerUserId?: string;
  name: string;
  capacity?: number;
  startDate: string;
  endDate?: string;
  days: string[];
  startTime: string;
  endTime: string;
}

export interface UpdateGymClassInput {
  trainerUserId?: string;
  name?: string;
  capacity?: number;
  endDate?: string;
  days?: string[];
  startTime?: string;
  endTime?: string;
  status?: GymClassStatus;
}

@Injectable()
export class GymClassService {
  constructor(private readonly prisma: PrismaService) {}

  create(organizationId: string, input: CreateGymClassInput): Promise<GymClass> {
    return this.prisma.client.gymClass.create({
      data: {
        id: customUUID.generate(),
        organizationId,
        branchId: input.branchId,
        trainerUserId: input.trainerUserId,
        name: input.name,
        capacity: input.capacity,
        startDate: new Date(input.startDate),
        endDate: input.endDate ? new Date(input.endDate) : undefined,
        days: input.days,
        startTime: input.startTime,
        endTime: input.endTime,
      },
    });
  }

  list(organizationId: string) {
    return this.prisma.client.gymClass.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
    });
  }

  private async findOwned(organizationId: string, id: string) {
    const gymClass = await this.prisma.client.gymClass.findFirst({
      where: { id, organizationId },
    });

    if (!gymClass) {
      throw new NotFoundException("Class not found.");
    }

    return gymClass;
  }

  async get(organizationId: string, id: string) {
    return this.findOwned(organizationId, id);
  }

  async update(organizationId: string, id: string, input: UpdateGymClassInput) {
    await this.findOwned(organizationId, id);

    return this.prisma.client.gymClass.update({
      where: { id },
      data: {
        trainerUserId: input.trainerUserId,
        name: input.name,
        capacity: input.capacity,
        endDate: input.endDate ? new Date(input.endDate) : undefined,
        days: input.days,
        startTime: input.startTime,
        endTime: input.endTime,
        status: input.status,
      },
    });
  }
}
