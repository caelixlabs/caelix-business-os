import { Test, TestingModule } from "@nestjs/testing";

import { PrismaService } from "@/common/prisma/prisma.service";
import { EventBus } from "@/common/ddd";

import { EnquiryPrismaRepository } from "@/business/enquiries/infrastructure/prisma/enquiry.prisma.repository";

import { Enquiry } from "@/business/enquiries/domain/entities/enquiry.entity";

import {
  EnquirySource,
  EnquiryStatus,
} from "@/business/enquiries/domain/enums";

jest.mock("@/common/prisma/prisma.service", () => ({
  PrismaService: class {},
}));

describe("EnquiryPrismaRepository Integration", () => {
  let repository: EnquiryPrismaRepository;

  const txClient = {
    enquiry: {
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

      enquiry: {
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
        EnquiryPrismaRepository,

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

    repository = module.get(EnquiryPrismaRepository);
  });

  it("should persist an enquiry and publish its domain event", async () => {
    const enquiry = Enquiry.create({
      id: "enquiry-1",
      organizationId: "org-1",
      branchId: "branch-1",
      contactId: "contact-1",
      assignedUserId: "user-1",
      source: EnquirySource.WEBSITE,
      subject: "Interested in guitar classes",
      description: "Looking for beginner guitar lessons.",
    });

    txClient.enquiry.create.mockResolvedValue({
      id: "enquiry-1",
      organizationId: "org-1",
      branchId: "branch-1",
      contactId: "contact-1",
      assignedUserId: "user-1",
      source: EnquirySource.WEBSITE,
      status: EnquiryStatus.NEW,
      subject: "Interested in guitar classes",
      description: "Looking for beginner guitar lessons.",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await repository.create(enquiry);

    expect(prismaMock.client.$transaction).toHaveBeenCalledTimes(1);

    expect(txClient.enquiry.create).toHaveBeenCalledTimes(1);

    expect(txClient.enquiry.create).toHaveBeenCalledWith({
      data: {
        id: "enquiry-1",
        organizationId: "org-1",
        branchId: "branch-1",
        contactId: "contact-1",
        assignedUserId: "user-1",
        source: EnquirySource.WEBSITE,
        status: EnquiryStatus.NEW,
        subject: "Interested in guitar classes",
        description: "Looking for beginner guitar lessons.",
      },
    });

    // Outbox/domain-event persistence happens
    // inside the same transaction.
    expect(txClient.domainEvent.createMany).toHaveBeenCalledTimes(1);

    const outboxRows = txClient.domainEvent.createMany.mock.calls[0][0].data;

    expect(outboxRows).toHaveLength(1);

    expect(outboxRows[0].eventName).toBe("EnquiryCreatedEvent");

    expect(outboxRows[0].aggregateId).toBe("enquiry-1");

    expect(outboxRows[0].aggregateType).toBe("Enquiry");

    // Event publishing happens after
    // the transaction completes.
    expect(eventBusMock.publishAll).toHaveBeenCalledTimes(1);

    const events = eventBusMock.publishAll.mock.calls[0][0];

    expect(events).toHaveLength(1);

    expect(events[0]).toBeInstanceOf(Object);

    expect(events[0].enquiryId).toBe("enquiry-1");

    expect(events[0].organizationId).toBe("org-1");

    expect(events[0].contactId).toBe("contact-1");

    expect(events[0].branchId).toBe("branch-1");

    // Domain events are consumed from
    // the aggregate after publishing.
    expect(enquiry.pullDomainEvents()).toHaveLength(0);

    expect(result).toBeInstanceOf(Enquiry);

    expect(result.id).toBe("enquiry-1");

    expect(result.organizationId).toBe("org-1");

    expect(result.branchId).toBe("branch-1");

    expect(result.contactId).toBe("contact-1");

    expect(result.status).toBe(EnquiryStatus.NEW);
  });

  it("should return enquiries for an organization as domain entities", async () => {
    prismaMock.client.enquiry.findMany.mockResolvedValue([
      {
        id: "enquiry-1",
        organizationId: "org-1",
        branchId: "branch-1",
        contactId: "contact-1",
        assignedUserId: null,
        source: EnquirySource.WEBSITE,
        status: EnquiryStatus.NEW,
        subject: "Guitar enquiry",
        description: "Beginner course.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "enquiry-2",
        organizationId: "org-1",
        branchId: "branch-2",
        contactId: "contact-2",
        assignedUserId: "user-2",
        source: EnquirySource.PHONE,
        status: EnquiryStatus.CONTACTED,
        subject: "Piano enquiry",
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const result = await repository.findByOrganization("org-1");

    expect(result).toHaveLength(2);

    expect(result[0]).toBeInstanceOf(Enquiry);

    expect(result[1]).toBeInstanceOf(Enquiry);

    expect(result[0].organizationId).toBe("org-1");

    expect(result[0].status).toBe(EnquiryStatus.NEW);

    expect(result[1].status).toBe(EnquiryStatus.CONTACTED);
  });

  it("should enforce organization isolation when finding an enquiry by id", async () => {
    prismaMock.client.enquiry.findFirst.mockResolvedValue(null);

    const result = await repository.findByIdForOrganization(
      "org-2",
      "enquiry-1"
    );

    expect(result).toBeNull();

    expect(prismaMock.client.enquiry.findFirst).toHaveBeenCalledWith({
      where: {
        id: "enquiry-1",
        organizationId: "org-2",
      },
    });
  });

  it("should return enquiries scoped to a branch", async () => {
    prismaMock.client.enquiry.findMany.mockResolvedValue([
      {
        id: "enquiry-1",
        organizationId: "org-1",
        branchId: "branch-1",
        contactId: "contact-1",
        assignedUserId: null,
        source: EnquirySource.WALK_IN,
        status: EnquiryStatus.NEW,
        subject: "Walk-in enquiry",
        description: "Customer visited branch.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const result = await repository.findByBranch("org-1", "branch-1");

    expect(result).toHaveLength(1);

    expect(result[0]).toBeInstanceOf(Enquiry);

    expect(result[0].organizationId).toBe("org-1");

    expect(result[0].branchId).toBe("branch-1");

    expect(prismaMock.client.enquiry.findMany).toHaveBeenCalledWith({
      where: {
        organizationId: "org-1",
        branchId: "branch-1",
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  });

  it("should return enquiries for a contact", async () => {
    prismaMock.client.enquiry.findMany.mockResolvedValue([
      {
        id: "enquiry-1",
        organizationId: "org-1",
        branchId: "branch-1",
        contactId: "contact-1",
        assignedUserId: null,
        source: EnquirySource.REFERRAL,
        status: EnquiryStatus.QUALIFIED,
        subject: "Referral enquiry",
        description: "Referred by existing student.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const result = await repository.findByContact("org-1", "contact-1");

    expect(result).toHaveLength(1);

    expect(result[0]).toBeInstanceOf(Enquiry);

    expect(result[0].contactId).toBe("contact-1");

    expect(result[0].status).toBe(EnquiryStatus.QUALIFIED);
  });

  it("should map null branch and optional fields correctly", async () => {
    prismaMock.client.enquiry.findUnique.mockResolvedValue({
      id: "enquiry-2",
      organizationId: "org-1",
      branchId: null,
      contactId: "contact-2",
      assignedUserId: null,
      source: EnquirySource.EMAIL,
      status: EnquiryStatus.NEW,
      subject: "Email enquiry",
      description: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await repository.findById("enquiry-2");

    expect(result).toBeInstanceOf(Enquiry);

    expect(result?.branchId).toBeUndefined();

    expect(result?.assignedUserId).toBeUndefined();

    expect(result?.description).toBeUndefined();
  });

  it("should persist status changes and their domain event", async () => {
    const enquiry = Enquiry.create({
      id: "enquiry-3",
      organizationId: "org-1",
      branchId: "branch-1",
      contactId: "contact-1",
      source: EnquirySource.WEBSITE,
      subject: "Demo enquiry",
    });

    // Move through a valid transition.
    enquiry.contact();

    expect(enquiry.status).toBe(EnquiryStatus.CONTACTED);

    txClient.enquiry.update.mockResolvedValue({
      id: "enquiry-3",
      organizationId: "org-1",
      branchId: "branch-1",
      contactId: "contact-1",
      assignedUserId: null,
      source: EnquirySource.WEBSITE,
      status: EnquiryStatus.CONTACTED,
      subject: "Demo enquiry",
      description: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await repository.update(enquiry);

    expect(prismaMock.client.$transaction).toHaveBeenCalledTimes(1);

    expect(txClient.enquiry.update).toHaveBeenCalledTimes(1);

    expect(txClient.domainEvent.createMany).toHaveBeenCalledTimes(1);

    const events = txClient.domainEvent.createMany.mock.calls[0][0].data;

    // There are two events here:
    //
    // 1. EnquiryCreatedEvent
    // 2. EnquiryStatusChangedEvent
    //
    // Because the aggregate was created
    // in this test and its events weren't
    // pulled before the update.
    expect(events.length).toBeGreaterThanOrEqual(2);

    expect(
      events.some((event: any) => event.eventName === "EnquiryCreatedEvent")
    ).toBe(true);

    expect(
      events.some(
        (event: any) => event.eventName === "EnquiryStatusChangedEvent"
      )
    ).toBe(true);

    expect(eventBusMock.publishAll).toHaveBeenCalledTimes(1);

    expect(result).toBeInstanceOf(Enquiry);

    expect(result.status).toBe(EnquiryStatus.CONTACTED);
  });

  it("should reject an invalid status transition", () => {
    const enquiry = Enquiry.create({
      id: "enquiry-4",
      organizationId: "org-1",
      branchId: "branch-1",
      contactId: "contact-1",
      source: EnquirySource.WEBSITE,
      subject: "Invalid transition",
    });

    expect(() => enquiry.convert()).toThrow(
      "Only contacted or qualified enquiries can be converted."
    );
  });

  it("should not allow a converted enquiry to become lost", () => {
    const enquiry = Enquiry.create({
      id: "enquiry-5",
      organizationId: "org-1",
      branchId: "branch-1",
      contactId: "contact-1",
      source: EnquirySource.WEBSITE,
      subject: "Converted enquiry",
    });

    enquiry.contact();
    enquiry.qualify();
    enquiry.convert();

    expect(enquiry.status).toBe(EnquiryStatus.CONVERTED);

    expect(() => enquiry.lose()).toThrow(
      "A converted enquiry cannot be marked as lost."
    );
  });
});
