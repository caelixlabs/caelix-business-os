import { Test, TestingModule } from "@nestjs/testing";

import { PrismaService } from "@/common/prisma/prisma.service";

import { EventBus } from "@/common/ddd";

import { InventoryItemPrismaRepository } from "@/business/inventory/infrastructure/prisma/inventory-item.prisma.repository";

import { InventoryItem } from "@/business/inventory/domain/entities/inventory-item.entity";

import { InventoryStatus } from "@/business/inventory/domain/enums";

jest.mock("@/common/prisma/prisma.service", () => ({
  PrismaService: class {},
}));

describe("InventoryItemPrismaRepository Integration", () => {
  let repository: InventoryItemPrismaRepository;

  const txClient = {
    inventoryItem: {
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

      inventoryItem: {
        findUnique: jest.fn(),
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
        InventoryItemPrismaRepository,

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

    repository = module.get(InventoryItemPrismaRepository);
  });

  it("should persist inventory and publish its domain event", async () => {
    const inventory = InventoryItem.create({
      id: "inventory-1",
      organizationId: "org-1",
      branchId: "branch-1",
      productId: "product-1",
      quantityOnHand: 10,
      quantityReserved: 2,
      reorderLevel: 3,
    });

    txClient.inventoryItem.create.mockResolvedValue({
      id: "inventory-1",
      organizationId: "org-1",
      branchId: "branch-1",
      productId: "product-1",
      quantityOnHand: 10,
      quantityReserved: 2,
      reorderLevel: 3,
      status: InventoryStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await repository.create(inventory);
    expect(prismaMock.client.$transaction).toHaveBeenCalledTimes(1);
    expect(txClient.inventoryItem.create).toHaveBeenCalledTimes(1);
    expect(txClient.domainEvent.createMany).toHaveBeenCalledTimes(1);
    expect(eventBusMock.publishAll).toHaveBeenCalledTimes(1);
    expect(result).toBeInstanceOf(InventoryItem);
    expect(result.organizationId).toBe("org-1");
    expect(result.branchId).toBe("branch-1");
    expect(result.productId).toBe("product-1");
    expect(result.quantityOnHand).toBe(10);
    expect(result.quantityReserved).toBe(2);
    expect(result.quantityAvailable).toBe(8);
  });

  it("should return inventory scoped to a branch", async () => {
    prismaMock.client.inventoryItem.findMany.mockResolvedValue([
      {
        id: "inventory-1",
        organizationId: "org-1",
        branchId: "branch-1",
        productId: "product-1",
        quantityOnHand: 10,
        quantityReserved: 2,
        reorderLevel: 3,
        status: InventoryStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const result = await repository.findByBranch("org-1", "branch-1");
    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(InventoryItem);
    expect(result[0].branchId).toBe("branch-1");
  });

  it("should enforce organization and branch and product uniqueness", async () => {
    prismaMock.client.inventoryItem.findUnique.mockResolvedValue({
      id: "inventory-1",
      organizationId: "org-1",
      branchId: "branch-1",
      productId: "product-1",
      quantityOnHand: 10,
      quantityReserved: 0,
      reorderLevel: 2,
      status: InventoryStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await repository.findByBranchAndProduct(
      "org-1",
      "branch-1",
      "product-1"
    );

    expect(result).toBeInstanceOf(InventoryItem);
    expect(result?.organizationId).toBe("org-1");
    expect(result?.branchId).toBe("branch-1");
    expect(result?.productId).toBe("product-1");
  });
});
