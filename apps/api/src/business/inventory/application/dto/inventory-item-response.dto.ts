import { InventoryItem } from "../../domain/entities/inventory-item.entity";

export class InventoryItemResponseDto {
  id!: string;
  organizationId!: string;
  branchId!: string;
  productId!: string;
  quantityOnHand!: number;
  quantityReserved!: number;
  quantityAvailable!: number;
  reorderLevel!: number;
  status!: string;

  static fromDomain(item: InventoryItem): InventoryItemResponseDto {
    const dto = new InventoryItemResponseDto();
    dto.id = item.id;
    dto.organizationId = item.organizationId;
    dto.branchId = item.branchId;
    dto.productId = item.productId;
    dto.quantityOnHand = item.quantityOnHand;
    dto.quantityReserved = item.quantityReserved;
    dto.quantityAvailable = item.quantityAvailable;
    dto.reorderLevel = item.reorderLevel;
    dto.status = item.status;
    return dto;
  }

  static fromDomainList(items: InventoryItem[]): InventoryItemResponseDto[] {
    return items.map((item) => InventoryItemResponseDto.fromDomain(item));
  }
}
