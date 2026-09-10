import { Inject, Injectable } from "@nestjs/common";

import { EntityNotFoundException } from "@/common/framework/exceptions";

import { INVENTORY_ITEM_REPOSITORY } from "../../domain/repositories/token";
import type { InventoryItemRepository } from "../../domain";

import { GetInventoryItemQuery } from "./get-inventory-item.query";

@Injectable()
export class GetInventoryItemHandler {
  constructor(
    @Inject(INVENTORY_ITEM_REPOSITORY)
    private readonly repository: InventoryItemRepository
  ) {}

  async execute(query: GetInventoryItemQuery) {
    const inventory = await this.repository.findById(query.id);

    if (!inventory || inventory.organizationId !== query.organizationId) {
      throw new EntityNotFoundException("InventoryItem", query.id);
    }

    return inventory;
  }
}
