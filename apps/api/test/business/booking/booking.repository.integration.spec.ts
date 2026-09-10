import { Test, TestingModule } from "@nestjs/testing";

import { PrismaService } from "@/common/prisma/prisma.service";
import { EventBus } from "@/common/ddd";

import { BookingPrismaRepository } from "@/business/booking/infrastructure/prisma/booking.prisma.repository";

import { Booking } from "@/business/booking/domain/entities/booking.entity";

import { BookingStatus } from "@/business/booking/domain/enums";

jest.mock("@/common/prisma/prisma.service", () => ({
  PrismaService: class {},
}));

describe("BookingPrismaRepository Integration", () => {
  let repository: BookingPrismaRepository;

  const txClient = {
    booking: {
      create: jest.fn(),
      update: jest.fn(),
    },

    domainEvent: {
      createMany: jest.fn(),
    },
  };

  const prismaMock = {
    client: {
      $transaction: jest.fn(
        async (work: (tx: typeof txClient) => Promise<unknown>) =>
          work(txClient)
      ),

      booking: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        delete: jest.fn(),
      },
    },
  };

  const eventBusMock = {
    publish: jest.fn(),
    publishAll: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingPrismaRepository,

        {
          provide: PrismaService,
          useValue: prismaMock,
        },

        {
          provide: EventBus,
          useValue: eventBusMock,
        },
      ],
    }).compile();

    repository = module.get(BookingPrismaRepository);
  });

  it("should persist booking and publish its domain event", async () => {
    const scheduledAt = new Date("2026-08-20T10:00:00.000Z");

    const booking = Booking.create({
      id: "booking-1",
      organizationId: "org-1",
      branchId: "branch-1",
      contactId: "contact-1",
      scheduledAt,
      notes: "Demo class",
    });

    txClient.booking.create.mockResolvedValue({
      id: "booking-1",
      organizationId: "org-1",
      branchId: "branch-1",
      contactId: "contact-1",
      scheduledAt,
      status: BookingStatus.DRAFT,
      notes: "Demo class",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await repository.create(booking);

    expect(prismaMock.client.$transaction).toHaveBeenCalledTimes(1);

    expect(txClient.booking.create).toHaveBeenCalledTimes(1);

    expect(txClient.domainEvent.createMany).toHaveBeenCalledTimes(1);

    const events = txClient.domainEvent.createMany.mock.calls[0][0].data;

    expect(events).toHaveLength(1);

    expect(events[0].eventName).toBe("BookingCreatedEvent");

    expect(events[0].aggregateId).toBe("booking-1");

    expect(events[0].aggregateType).toBe("Booking");

    expect(eventBusMock.publishAll).toHaveBeenCalledTimes(1);

    const publishedEvents = eventBusMock.publishAll.mock.calls[0][0];

    expect(publishedEvents).toHaveLength(1);

    expect(publishedEvents[0].bookingId).toBe("booking-1");

    expect(publishedEvents[0].organizationId).toBe("org-1");

    expect(publishedEvents[0].contactId).toBe("contact-1");

    expect(booking.pullDomainEvents()).toHaveLength(0);

    expect(result).toBeInstanceOf(Booking);

    expect(result.status).toBe(BookingStatus.DRAFT);
  });

  it("should return organization bookings as domain entities", async () => {
    const scheduledAt = new Date("2026-08-20T10:00:00.000Z");

    prismaMock.client.booking.findMany.mockResolvedValue([
      {
        id: "booking-1",
        organizationId: "org-1",
        branchId: "branch-1",
        contactId: "contact-1",
        scheduledAt,
        status: BookingStatus.DRAFT,
        notes: "Demo",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        id: "booking-2",
        organizationId: "org-1",
        branchId: "branch-2",
        contactId: "contact-2",
        scheduledAt,
        status: BookingStatus.CONFIRMED,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const result = await repository.findByOrganization("org-1");

    expect(result).toHaveLength(2);

    expect(result[0]).toBeInstanceOf(Booking);

    expect(result[1]).toBeInstanceOf(Booking);

    expect(result[0].organizationId).toBe("org-1");

    expect(result[0].status).toBe(BookingStatus.DRAFT);

    expect(result[1].status).toBe(BookingStatus.CONFIRMED);
  });

  it("should enforce organization isolation", async () => {
    prismaMock.client.booking.findFirst.mockResolvedValue(null);

    const result = await repository.findByIdForOrganization(
      "org-2",
      "booking-1"
    );

    expect(result).toBeNull();

    expect(prismaMock.client.booking.findFirst).toHaveBeenCalledWith({
      where: {
        id: "booking-1",
        organizationId: "org-2",
      },
    });
  });

  it("should return bookings scoped to a branch", async () => {
    prismaMock.client.booking.findMany.mockResolvedValue([
      {
        id: "booking-1",
        organizationId: "org-1",
        branchId: "branch-1",
        contactId: "contact-1",
        scheduledAt: new Date("2026-08-20T10:00:00.000Z"),
        status: BookingStatus.CONFIRMED,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const result = await repository.findByBranch("org-1", "branch-1");

    expect(result).toHaveLength(1);

    expect(result[0]).toBeInstanceOf(Booking);

    expect(result[0].branchId).toBe("branch-1");

    expect(prismaMock.client.booking.findMany).toHaveBeenCalledWith({
      where: {
        organizationId: "org-1",
        branchId: "branch-1",
      },
      orderBy: {
        scheduledAt: "asc",
      },
    });
  });

  it("should return bookings for a contact", async () => {
    prismaMock.client.booking.findMany.mockResolvedValue([
      {
        id: "booking-1",
        organizationId: "org-1",
        branchId: "branch-1",
        contactId: "contact-1",
        scheduledAt: new Date("2026-08-20T10:00:00.000Z"),
        status: BookingStatus.CONFIRMED,
        notes: "Appointment",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const result = await repository.findByContact("org-1", "contact-1");

    expect(result).toHaveLength(1);

    expect(result[0]).toBeInstanceOf(Booking);

    expect(result[0].contactId).toBe("contact-1");
  });

  it("should return bookings by status", async () => {
    prismaMock.client.booking.findMany.mockResolvedValue([
      {
        id: "booking-1",
        organizationId: "org-1",
        branchId: "branch-1",
        contactId: "contact-1",
        scheduledAt: new Date("2026-08-20T10:00:00.000Z"),
        status: BookingStatus.CONFIRMED,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const result = await repository.findByStatus(
      "org-1",
      BookingStatus.CONFIRMED
    );

    expect(result).toHaveLength(1);

    expect(result[0].status).toBe(BookingStatus.CONFIRMED);

    expect(prismaMock.client.booking.findMany).toHaveBeenCalledWith({
      where: {
        organizationId: "org-1",
        status: BookingStatus.CONFIRMED,
      },
      orderBy: {
        scheduledAt: "asc",
      },
    });
  });

  it("should return bookings within a schedule range", async () => {
    const from = new Date("2026-08-20T00:00:00.000Z");

    const to = new Date("2026-08-21T00:00:00.000Z");

    prismaMock.client.booking.findMany.mockResolvedValue([]);

    const result = await repository.findBySchedule("org-1", from, to);

    expect(result).toHaveLength(0);

    expect(prismaMock.client.booking.findMany).toHaveBeenCalledWith({
      where: {
        organizationId: "org-1",

        scheduledAt: {
          gte: from,
          lte: to,
        },
      },

      orderBy: {
        scheduledAt: "asc",
      },
    });
  });

  it("should map cancelled booking correctly", async () => {
    prismaMock.client.booking.findUnique.mockResolvedValue({
      id: "booking-1",
      organizationId: "org-1",
      branchId: null,
      contactId: "contact-1",
      scheduledAt: new Date("2026-08-20T10:00:00.000Z"),
      status: BookingStatus.CANCELLED,
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await repository.findById("booking-1");

    expect(result).toBeInstanceOf(Booking);

    expect(result?.status).toBe(BookingStatus.CANCELLED);

    expect(result?.branchId).toBeUndefined();
  });

  it("should enforce valid booking state transitions", () => {
    const booking = Booking.create({
      id: "booking-1",
      organizationId: "org-1",
      branchId: "branch-1",
      contactId: "contact-1",
      scheduledAt: new Date("2026-08-20T10:00:00.000Z"),
    });

    booking.confirm();

    expect(booking.status).toBe(BookingStatus.CONFIRMED);

    booking.complete();

    expect(booking.status).toBe(BookingStatus.COMPLETED);

    expect(() => booking.cancel()).toThrow(
      "A completed booking cannot be cancelled."
    );
  });

  it("should reject completing a DRAFT booking", () => {
    const booking = Booking.create({
      id: "booking-2",
      organizationId: "org-1",
      contactId: "contact-1",
      scheduledAt: new Date("2026-08-20T10:00:00.000Z"),
    });

    expect(() => booking.complete()).toThrow(
      "Only CONFIRMED bookings can be completed."
    );
  });
});
