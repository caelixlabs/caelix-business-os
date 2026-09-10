import { Inject, Injectable } from "@nestjs/common";

import { EntityNotFoundException } from "@/common/framework/exceptions";

import { AdjustStockDto } from "./adjust-stock.dto";
import { INVENTORY_ITEM_REPOSITORY } from "../../domain/repositories/token";
import type { InventoryItemRepository } from "../../domain";

@Injectable()
export class AdjustStockHandler {
  constructor(
    @Inject(INVENTORY_ITEM_REPOSITORY)
    private readonly repository: InventoryItemRepository
  ) {}

  async execute(
    organizationId: string,
    inventoryId: string,
    dto: AdjustStockDto
  ) {
    const inventory = await this.repository.findById(inventoryId);

    if (!inventory || inventory.organizationId !== organizationId) {
      throw new EntityNotFoundException("InventoryItem", inventoryId);
    }

    inventory.adjustStock(dto.quantityDelta);

    return this.repository.update(inventory);
  }
}
