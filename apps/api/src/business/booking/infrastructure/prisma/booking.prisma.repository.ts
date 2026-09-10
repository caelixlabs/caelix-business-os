import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/prisma";
import { PrismaRepository } from "@/common/prisma/prisma.repository";
import { EventBus } from "@/common/ddd";
import { BookingStatus } from "../../domain/enums";
import { BookingMapper } from "./booking.mapper";
import { BookingRepository } from "../../domain/repositories";
import { Booking } from "../../domain/entities/booking.entity";

@Injectable()
export class BookingPrismaRepository
  extends PrismaRepository
  implements BookingRepository
{
  constructor(prisma: PrismaService, eventBus: EventBus) {
    super(prisma, eventBus);
  }

  async create(entity: Booking): Promise<Booking> {
    const model = await this.runInTransaction(entity, "Booking", (tx) =>
      tx.booking.create({
        data: BookingMapper.toPersistence(entity),
      })
    );

    return BookingMapper.toDomain(model);
  }

  async findById(id: string): Promise<Booking | null> {
    const model = await this.prisma.client.booking.findUnique({
      where: { id },
    });

    return model ? BookingMapper.toDomain(model) : null;
  }

  async findByIdForOrganization(
    organizationId: string,
    bookingId: string
  ): Promise<Booking | null> {
    const model = await this.prisma.client.booking.findFirst({
      where: {
        id: bookingId,
        organizationId,
      },
    });

    return model ? BookingMapper.toDomain(model) : null;
  }

  async findByOrganization(organizationId: string): Promise<Booking[]> {
    const rows = await this.prisma.client.booking.findMany({
      where: {
        organizationId,
      },

      orderBy: {
        scheduledAt: "asc",
      },
    });

    return rows.map(BookingMapper.toDomain);
  }

  async findByBranch(
    organizationId: string,
    branchId: string
  ): Promise<Booking[]> {
    const rows = await this.prisma.client.booking.findMany({
      where: {
        organizationId,
        branchId,
      },

      orderBy: {
        scheduledAt: "asc",
      },
    });

    return rows.map(BookingMapper.toDomain);
  }

  async findByContact(
    organizationId: string,
    contactId: string
  ): Promise<Booking[]> {
    const rows = await this.prisma.client.booking.findMany({
      where: {
        organizationId,
        contactId,
      },

      orderBy: {
        scheduledAt: "desc",
      },
    });

    return rows.map(BookingMapper.toDomain);
  }

  async findByStatus(
    organizationId: string,
    status: BookingStatus
  ): Promise<Booking[]> {
    const rows = await this.prisma.client.booking.findMany({
      where: {
        organizationId,
        status,
      },

      orderBy: {
        scheduledAt: "asc",
      },
    });

    return rows.map(BookingMapper.toDomain);
  }

  async findBySchedule(
    organizationId: string,
    from: Date,
    to: Date
  ): Promise<Booking[]> {
    const rows = await this.prisma.client.booking.findMany({
      where: {
        organizationId,

        scheduledAt: {
          gte: from,
          lte: to,
        },
      },

      orderBy: {
        scheduledAt: "asc",
      },
    });

    return rows.map(BookingMapper.toDomain);
  }

  async findAll(): Promise<Booking[]> {
    const rows = await this.prisma.client.booking.findMany({
      orderBy: {
        scheduledAt: "desc",
      },
    });

    return rows.map(BookingMapper.toDomain);
  }

  async update(entity: Booking): Promise<Booking> {
    const model = await this.runInTransaction(entity, "Booking", (tx) =>
      tx.booking.update({
        where: {
          id: entity.id,
        },

        data: BookingMapper.toPersistence(entity),
      })
    );

    return BookingMapper.toDomain(model);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.client.booking.delete({
      where: {
        id,
      },
    });
  }
}
