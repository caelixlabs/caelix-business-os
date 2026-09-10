import { Inject, Injectable } from "@nestjs/common";

import { INVENTORY_ITEM_REPOSITORY } from "../../domain/repositories/token";
import type { InventoryItemRepository } from "../../domain";

import { ListInventoryQuery } from "./list-inventory.query";

@Injectable()
export class ListInventoryHandler {
  constructor(
    @Inject(INVENTORY_ITEM_REPOSITORY)
    private readonly repository: InventoryItemRepository
  ) {}

  async execute(query: ListInventoryQuery) {
    if (query.branchId) {
      return this.repository.findByBranch(query.organizationId, query.branchId);
    }

    if (query.productId) {
      return this.repository.findByProduct(
        query.organizationId,
        query.productId
      );
    }

    return this.repository.findByOrganization(query.organizationId);
  }
}
