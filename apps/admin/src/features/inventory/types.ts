export type InventoryStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export interface InventoryItem {
  id: string;
  organizationId: string;
  branchId: string;
  productId: string;
  quantityOnHand: number;
  quantityReserved: number;
  quantityAvailable: number;
  reorderLevel: number;
  status: InventoryStatus;
}
