import { Repository } from "@/common/ddd";

import { InventoryItem } from "../entities/inventory-item.entity";

export interface InventoryItemRepository extends Repository<InventoryItem> {
  findByBranchAndProduct(
    organizationId: string,
    branchId: string,
    productId: string
  ): Promise<InventoryItem | null>;

  findByOrganization(organizationId: string): Promise<InventoryItem[]>;

  findByBranch(
    organizationId: string,
    branchId: string
  ): Promise<InventoryItem[]>;

  findByProduct(
    organizationId: string,
    productId: string
  ): Promise<InventoryItem[]>;
}
