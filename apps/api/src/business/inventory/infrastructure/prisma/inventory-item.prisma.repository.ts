import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/prisma";
import { PrismaRepository } from "@/common/prisma/prisma.repository";
import { EventBus } from "@/common/ddd";
import { InventoryItem, InventoryItemRepository } from "../../domain";
import { InventoryItemMapper } from "../inventory-item.mapper";

@Injectable()
export class InventoryItemPrismaRepository
  extends PrismaRepository
  implements InventoryItemRepository
{
  constructor(prisma: PrismaService, eventBus: EventBus) {
    super(prisma, eventBus);
  }

  async create(entity: InventoryItem): Promise<InventoryItem> {
    const model = await this.runInTransaction(entity, "InventoryItem", (tx) =>
      tx.inventoryItem.create({
        data: InventoryItemMapper.toPersistence(entity),
      })
    );

    return InventoryItemMapper.toDomain(model);
  }

  async findById(id: string): Promise<InventoryItem | null> {
    const model = await this.prisma.client.inventoryItem.findUnique({
      where: {
        id,
      },
    });

    return model ? InventoryItemMapper.toDomain(model) : null;
  }

  async findByBranchAndProduct(
    organizationId: string,
    branchId: string,
    productId: string
  ): Promise<InventoryItem | null> {
    const model = await this.prisma.client.inventoryItem.findUnique({
      where: {
        organizationId_branchId_productId: {
          organizationId,
          branchId,
          productId,
        },
      },
    });

    return model ? InventoryItemMapper.toDomain(model) : null;
  }

  async findByOrganization(organizationId: string): Promise<InventoryItem[]> {
    const rows = await this.prisma.client.inventoryItem.findMany({
      where: {
        organizationId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return rows.map(InventoryItemMapper.toDomain);
  }

  async findByBranch(
    organizationId: string,
    branchId: string
  ): Promise<InventoryItem[]> {
    const rows = await this.prisma.client.inventoryItem.findMany({
      where: {
        organizationId,
        branchId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return rows.map(InventoryItemMapper.toDomain);
  }

  async findByProduct(
    organizationId: string,
    productId: string
  ): Promise<InventoryItem[]> {
    const rows = await this.prisma.client.inventoryItem.findMany({
      where: {
        organizationId,
        productId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return rows.map(InventoryItemMapper.toDomain);
  }

  async findAll(): Promise<InventoryItem[]> {
    const rows = await this.prisma.client.inventoryItem.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return rows.map(InventoryItemMapper.toDomain);
  }

  async update(entity: InventoryItem): Promise<InventoryItem> {
    const model = await this.runInTransaction(entity, "InventoryItem", (tx) =>
      tx.inventoryItem.update({
        where: {
          id: entity.id,
        },
        data: InventoryItemMapper.toPersistence(entity),
      })
    );

    return InventoryItemMapper.toDomain(model);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.client.inventoryItem.delete({
      where: {
        id,
      },
    });
  }
}
