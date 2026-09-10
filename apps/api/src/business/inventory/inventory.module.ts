import { Module } from "@nestjs/common";
import { InventoryItemPrismaRepository } from "./infrastructure/prisma/inventory-item.prisma.repository";
import { CreateInventoryItemHandler } from "./application/create-inventory-item/create-inventory-item.handler";
import { GetInventoryItemHandler } from "./application/get-inventory-item/get-inventory-item.handler";
import { ListInventoryHandler } from "./application/list-inventory/list-inventory.handler";
import { AdjustStockHandler } from "./application/adjust-stock/adjust-stock.handler";
import { ArchiveInventoryItemHandler } from "./application/archive-inventory-item/archive-inventory-item.handler";
import { INVENTORY_ITEM_REPOSITORY } from "./domain/repositories/token";

@Module({
  providers: [
    {
      provide: INVENTORY_ITEM_REPOSITORY,
      useClass: InventoryItemPrismaRepository,
    },

    CreateInventoryItemHandler,
    GetInventoryItemHandler,
    ListInventoryHandler,
    AdjustStockHandler,
    ArchiveInventoryItemHandler,
  ],

  exports: [
    INVENTORY_ITEM_REPOSITORY,

    CreateInventoryItemHandler,
    GetInventoryItemHandler,
    ListInventoryHandler,
    AdjustStockHandler,
    ArchiveInventoryItemHandler,
  ],
})
export class InventoryModule {}
