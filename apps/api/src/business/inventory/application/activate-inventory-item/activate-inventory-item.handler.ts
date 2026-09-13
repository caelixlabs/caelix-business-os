import { Inject, Injectable } from "@nestjs/common";

import { EntityNotFoundException } from "@/common/framework/exceptions";

import { INVENTORY_ITEM_REPOSITORY } from "../../domain/repositories/token";
import type { InventoryItemRepository } from "../../domain";

@Injectable()
export class ActivateInventoryItemHandler {
  constructor(
    @Inject(INVENTORY_ITEM_REPOSITORY)
    private readonly repository: InventoryItemRepository
  ) {}

  async execute(organizationId: string, inventoryId: string) {
    const inventory = await this.repository.findById(inventoryId);

    if (!inventory || inventory.organizationId !== organizationId) {
      throw new EntityNotFoundException("InventoryItem", inventoryId);
    }

    inventory.activate();

    return this.repository.update(inventory);
  }
}
