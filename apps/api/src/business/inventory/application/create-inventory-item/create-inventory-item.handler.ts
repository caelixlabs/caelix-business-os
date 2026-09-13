import { ConflictException, Inject, Injectable } from "@nestjs/common";

import { customUUID } from "@/kernel/utility/uuid";

import { InventoryItem } from "../../domain/entities/inventory-item.entity";

import { INVENTORY_ITEM_REPOSITORY } from "../../domain/repositories/token";
import type { InventoryItemRepository } from "../../domain";

import { CreateInventoryItemDto } from "./create-inventory-item.dto";

@Injectable()
export class CreateInventoryItemHandler {
  constructor(
    @Inject(INVENTORY_ITEM_REPOSITORY)
    private readonly repository: InventoryItemRepository
  ) {}

  async execute(organizationId: string, dto: CreateInventoryItemDto): Promise<InventoryItem> {
    const existing = await this.repository.findByBranchAndProduct(
      organizationId,
      dto.branchId,
      dto.productId
    );

    if (existing) {
      throw new ConflictException(
        "Inventory already exists for this product at this branch."
      );
    }

    const inventory = InventoryItem.create({
      id: customUUID.generate(),

      organizationId,

      branchId: dto.branchId,

      productId: dto.productId,

      quantityOnHand: dto.quantityOnHand,

      quantityReserved: dto.quantityReserved,

      reorderLevel: dto.reorderLevel,
    });

    return this.repository.create(inventory);
  }
}
