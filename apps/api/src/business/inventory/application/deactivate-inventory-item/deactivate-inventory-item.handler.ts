import { Inject, Injectable } from "@nestjs/common";

import { EntityNotFoundException } from "@/common/framework/exceptions";

import { INVENTORY_ITEM_REPOSITORY } from "../../domain/repositories/token";
import type { InventoryItemRepository } from "../../domain";

@Injectable()
export class DeactivateInventoryItemHandler {
  constructor(
    @Inject(INVENTORY_ITEM_REPOSITORY)
    private readonly repository: InventoryItemRepository
  ) {}

  async execute(organizationId: string, inventoryId: string) {
    const inventory = await this.repository.findById(inventoryId);

    if (!inventory || inventory.organizationId !== organizationId) {
      throw new EntityNotFoundException("InventoryItem", inventoryId);
    }

    inventory.deactivate();

    return this.repository.update(inventory);
  }
}
