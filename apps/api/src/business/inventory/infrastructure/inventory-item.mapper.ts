import {
  InventoryItem as PrismaInventoryItem,
  InventoryStatus as PrismaInventoryStatus,
} from "@caelix-business-os/database";

import { InventoryItem } from "../domain/entities/inventory-item.entity";

import { InventoryStatus } from "../domain/enums";

export class InventoryItemMapper {
  static toDomain(model: PrismaInventoryItem): InventoryItem {
    return new InventoryItem(
      model.id,
      model.organizationId,
      model.branchId,
      model.productId,
      model.quantityOnHand,
      model.quantityReserved,
      model.reorderLevel,
      model.status as InventoryStatus
    );
  }

  static toPersistence(entity: InventoryItem) {
    return {
      id: entity.id,
      organizationId: entity.organizationId,
      branchId: entity.branchId,
      productId: entity.productId,
      quantityOnHand: entity.quantityOnHand,
      quantityReserved: entity.quantityReserved,
      reorderLevel: entity.reorderLevel,
      status: entity.status as PrismaInventoryStatus,
    };
  }
}
