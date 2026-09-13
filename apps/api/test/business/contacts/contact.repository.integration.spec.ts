import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "@/common/prisma/prisma.service";
import { ContactPrismaRepository } from "@/business/contacts/infrastructure/prisma/contact.prisma.repository";
import { Contact } from "@/business/contacts/domain/entities/contact.entity";
import { ContactStatus, ContactType } from "@/business/contacts/domain/enums";
import { CreateContactUseCase } from "@/business/contacts/application/create-contact/create-contact.use-case";
import { CONTACT_REPOSITORY } from "@/business/contacts/domain/repositories";

/**
 * Prevent Jest from loading the ESM database package.
 *
 * The repository itself receives PrismaService through DI,
 * so no real Prisma client is required for this test.
 */
jest.mock("@/common/prisma/prisma.service", () => ({
  PrismaService: class {},
}));

/**
 * ContactMapper imports Prisma enums from the database package.
 *
 * The database package is ESM:
 *
 *   packages/database/dist/index.js
 *
 * while the current Jest environment executes CommonJS.
 *
 * Mocking the package prevents Jest from attempting to execute:
 *
 *   export { prisma } from './client.js';
 */
jest.mock("@caelix-business-os/database", () => ({
  ContactType: {
    PERSON: "PERSON",
    BUSINESS: "BUSINESS",
  },

  ContactStatus: {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
    ARCHIVED: "ARCHIVED",
  },
}));

describe("ContactPrismaRepository Integration", () => {
  let repository: ContactPrismaRepository;

  const prismaMock = {
    client: {
      contact: {
        create: jest.fn(),

        findFirst: jest.fn(),

        findMany: jest.fn(),

        update: jest.fn(),

        delete: jest.fn(),
      },
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactPrismaRepository,

        {
          provide: PrismaService,

          useValue: prismaMock,
        },
      ],
    }).compile();

    repository = module.get(ContactPrismaRepository);
  });

  /**
   * ---------------------------------------------------------
   * CREATE
   * ---------------------------------------------------------
   */

  it("should persist a PERSON contact and return a Contact domain entity", async () => {
    const contact = Contact.create({
      id: "contact-1",

      organizationId: "org-1",

      branchId: "branch-1",

      type: ContactType.PERSON,

      firstName: "John",

      lastName: "Doe",

      email: "john.doe@example.com",

      phone: "+919999999999",

      notes: "Test contact",
    });

    prismaMock.client.contact.create.mockResolvedValue({
      id: "contact-1",

      organizationId: "org-1",

      branchId: "branch-1",

      type: "PERSON",

      status: "ACTIVE",

      firstName: "John",

      lastName: "Doe",

      companyName: null,

      email: "john.doe@example.com",

      phone: "+919999999999",

      notes: "Test contact",

      createdAt: new Date(),

      updatedAt: new Date(),
    });

    const result = await repository.create(contact);

    expect(prismaMock.client.contact.create).toHaveBeenCalledTimes(1);

    expect(prismaMock.client.contact.create).toHaveBeenCalledWith({
      data: {
        id: "contact-1",

        organizationId: "org-1",

        branchId: "branch-1",

        type: ContactType.PERSON,

        status: ContactStatus.ACTIVE,

        firstName: "John",

        lastName: "Doe",

        companyName: null,

        email: "john.doe@example.com",

        phone: "+919999999999",

        notes: "Test contact",
      },
    });

    expect(result).toBeInstanceOf(Contact);

    expect(result.id).toBe("contact-1");

    expect(result.organizationId).toBe("org-1");

    expect(result.branchId).toBe("branch-1");

    expect(result.type).toBe(ContactType.PERSON);

    expect(result.status).toBe(ContactStatus.ACTIVE);

    expect(result.firstName).toBe("John");

    expect(result.lastName).toBe("Doe");

    expect(result.email).toBe("john.doe@example.com");
  });

  /**
   * ---------------------------------------------------------
   * FIND BY ORGANIZATION
   *
   * Prisma rows must be converted back into Contact
   * domain entities.
   * ---------------------------------------------------------
   */

  it("should return organization contacts as Contact domain entities", async () => {
    prismaMock.client.contact.findMany.mockResolvedValue([
      {
        id: "contact-1",

        organizationId: "org-1",

        branchId: "branch-1",

        type: "PERSON",

        status: "ACTIVE",

        firstName: "John",

        lastName: "Doe",

        companyName: null,

        email: "john@example.com",

        phone: "+919999999999",

        notes: null,

        createdAt: new Date(),

        updatedAt: new Date(),
      },

      {
        id: "contact-2",

        organizationId: "org-1",

        branchId: null,

        type: "BUSINESS",

        status: "ACTIVE",

        firstName: null,

        lastName: null,

        companyName: "Caelix Music",

        email: "music@caelix.com",

        phone: null,

        notes: null,

        createdAt: new Date(),

        updatedAt: new Date(),
      },
    ]);

    const result = await repository.findByOrganization("org-1");

    expect(prismaMock.client.contact.findMany).toHaveBeenCalledWith({
      where: {
        organizationId: "org-1",
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    expect(result).toHaveLength(2);

    expect(result[0]).toBeInstanceOf(Contact);

    expect(result[1]).toBeInstanceOf(Contact);

    expect(result[0].id).toBe("contact-1");

    expect(result[0].type).toBe(ContactType.PERSON);

    expect(result[1].id).toBe("contact-2");

    expect(result[1].type).toBe(ContactType.BUSINESS);

    expect(result[1].companyName).toBe("Caelix Music");
  });

  /**
   * ---------------------------------------------------------
   * ORGANIZATION ISOLATION
   *
   * Repository query must always contain organizationId.
   * ---------------------------------------------------------
   */

  it("should enforce organization isolation when finding a contact by id", async () => {
    prismaMock.client.contact.findFirst.mockResolvedValue(null);

    const result = await repository.findById("org-1", "contact-1");

    expect(prismaMock.client.contact.findFirst).toHaveBeenCalledWith({
      where: {
        id: "contact-1",

        organizationId: "org-1",
      },
    });

    expect(result).toBeNull();
  });

  /**
   * ---------------------------------------------------------
   * BRANCH ASSOCIATION
   * ---------------------------------------------------------
   */

  it("should persist branch association", async () => {
    const contact = Contact.create({
      id: "contact-branch-1",

      organizationId: "org-1",

      branchId: "branch-delhi",

      type: ContactType.PERSON,

      firstName: "Aman",

      lastName: "Singh",
    });

    prismaMock.client.contact.create.mockResolvedValue({
      id: "contact-branch-1",

      organizationId: "org-1",

      branchId: "branch-delhi",

      type: "PERSON",

      status: "ACTIVE",

      firstName: "Aman",

      lastName: "Singh",

      companyName: null,

      email: null,

      phone: null,

      notes: null,

      createdAt: new Date(),

      updatedAt: new Date(),
    });

    const result = await repository.create(contact);

    const createCall = prismaMock.client.contact.create.mock.calls[0][0];

    expect(createCall.data.branchId).toBe("branch-delhi");

    expect(result.branchId).toBe("branch-delhi");
  });

  /**
   * ---------------------------------------------------------
   * PERSON DOMAIN VALIDATION
   * ---------------------------------------------------------
   */

  it("should reject a PERSON contact without first name or last name", () => {
    expect(() =>
      Contact.create({
        id: "contact-invalid-person",

        organizationId: "org-1",

        type: ContactType.PERSON,
      })
    ).toThrow("A PERSON contact must have a first name or last name.");

    expect(prismaMock.client.contact.create).not.toHaveBeenCalled();
  });

  /**
   * ---------------------------------------------------------
   * BUSINESS DOMAIN VALIDATION
   * ---------------------------------------------------------
   */

  it("should reject a BUSINESS contact without company name", () => {
    expect(() =>
      Contact.create({
        id: "contact-invalid-business",

        organizationId: "org-1",

        type: ContactType.BUSINESS,
      })
    ).toThrow("A BUSINESS contact must have a company name.");

    expect(prismaMock.client.contact.create).not.toHaveBeenCalled();
  });

  /**
   * ---------------------------------------------------------
   * ARCHIVED STATE MAPPING
   *
   * Prisma ARCHIVED
   *      ↓
   * ContactMapper
   *      ↓
   * Domain Contact.ARCHIVED
   * ---------------------------------------------------------
   */

  it("should map ARCHIVED Prisma state to ARCHIVED domain state", async () => {
    prismaMock.client.contact.findFirst.mockResolvedValue({
      id: "contact-archived",

      organizationId: "org-1",

      branchId: null,

      type: "PERSON",

      status: "ARCHIVED",

      firstName: "Archived",

      lastName: "Contact",

      companyName: null,

      email: null,

      phone: null,

      notes: null,

      createdAt: new Date(),

      updatedAt: new Date(),
    });

    const result = await repository.findById("org-1", "contact-archived");

    expect(result).toBeInstanceOf(Contact);

    expect(result?.status).toBe(ContactStatus.ARCHIVED);
  });

  /**
   * ---------------------------------------------------------
   * INACTIVE STATE MAPPING
   * ---------------------------------------------------------
   */

  it("should map INACTIVE Prisma state to INACTIVE domain state", async () => {
    prismaMock.client.contact.findFirst.mockResolvedValue({
      id: "contact-inactive",

      organizationId: "org-1",

      branchId: null,

      type: "PERSON",

      status: "INACTIVE",

      firstName: "Inactive",

      lastName: "Contact",

      companyName: null,

      email: null,

      phone: null,

      notes: null,

      createdAt: new Date(),

      updatedAt: new Date(),
    });

    const result = await repository.findById("org-1", "contact-inactive");

    expect(result).toBeInstanceOf(Contact);

    expect(result?.status).toBe(ContactStatus.INACTIVE);
  });
});

/**
 * =============================================================
 * CREATE CONTACT USE CASE
 * =============================================================
 *
 * Duplicate-email prevention belongs to the application/use-case
 * layer, NOT ContactPrismaRepository.
 *
 * We test it separately here so the repository contract remains
 * clean.
 */

describe("CreateContactUseCase", () => {
  const repositoryMock = {
    create: jest.fn(),

    findById: jest.fn(),

    findByEmail: jest.fn(),

    findByPhone: jest.fn(),

    findByOrganization: jest.fn(),

    update: jest.fn(),

    delete: jest.fn(),
  };

  let useCase: CreateContactUseCase;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateContactUseCase,

        {
          provide: CONTACT_REPOSITORY,

          useValue: repositoryMock,
        },
      ],
    }).compile();

    useCase = module.get(CreateContactUseCase);
  });

  it("should reject duplicate email within the organization", async () => {
    const existingContact = Contact.create({
      id: "existing-contact",

      organizationId: "org-1",

      type: ContactType.PERSON,

      firstName: "Existing",

      email: "existing@example.com",
    });

    repositoryMock.findByEmail.mockResolvedValue(existingContact);

    await expect(
      useCase.execute("org-1", {
        type: ContactType.PERSON,

        firstName: "New",

        lastName: "Contact",

        email: "existing@example.com",
      })
    ).rejects.toThrow("A contact with this email already exists.");

    expect(repositoryMock.findByEmail).toHaveBeenCalledWith(
      "org-1",
      "existing@example.com"
    );

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });

  it("should allow the same email check to remain organization scoped", async () => {
    repositoryMock.findByEmail.mockResolvedValue(null);

    repositoryMock.create.mockImplementation(
      async (contact: Contact) => contact
    );

    const result = await useCase.execute("org-2", {
      type: ContactType.PERSON,

      firstName: "John",

      lastName: "Doe",

      email: "john@example.com",
    });

    expect(repositoryMock.findByEmail).toHaveBeenCalledWith(
      "org-2",
      "john@example.com"
    );

    expect(repositoryMock.create).toHaveBeenCalledTimes(1);

    expect(result).toBeInstanceOf(Contact);

    expect(result.organizationId).toBe("org-2");
  });
});
