import { AggregateRoot } from "@/common/ddd";

import { InventoryStatus } from "../enums";

import { InventoryCreatedEvent, StockAdjustedEvent } from "../events";

export interface CreateInventoryItemProps {
  id: string;
  organizationId: string;
  branchId: string;
  productId: string;
  quantityOnHand?: number;
  quantityReserved?: number;
  reorderLevel?: number;
}

export class InventoryItem extends AggregateRoot<string> {
  private _quantityOnHand: number;
  private _quantityReserved: number;
  private _reorderLevel: number;
  private _status: InventoryStatus;

  constructor(
    id: string,

    public readonly organizationId: string,
    public readonly branchId: string,
    public readonly productId: string,
    quantityOnHand: number,
    quantityReserved: number,
    reorderLevel: number,
    status: InventoryStatus
  ) {
    super(id);
    this._quantityOnHand = quantityOnHand;
    this._quantityReserved = quantityReserved;
    this._reorderLevel = reorderLevel;
    this._status = status;
  }

  public static create(props: CreateInventoryItemProps): InventoryItem {
    const quantityOnHand = props.quantityOnHand ?? 0;
    const quantityReserved = props.quantityReserved ?? 0;
    const reorderLevel = props.reorderLevel ?? 0;

    if (quantityOnHand < 0) {
      throw new Error("Quantity on hand cannot be negative.");
    }

    if (quantityReserved < 0) {
      throw new Error("Reserved quantity cannot be negative.");
    }

    if (quantityReserved > quantityOnHand) {
      throw new Error("Reserved quantity cannot exceed quantity on hand.");
    }

    if (reorderLevel < 0) {
      throw new Error("Reorder level cannot be negative.");
    }

    const inventory = new InventoryItem(
      props.id,
      props.organizationId,
      props.branchId,
      props.productId,
      quantityOnHand,
      quantityReserved,
      reorderLevel,
      InventoryStatus.ACTIVE
    );

    inventory.addDomainEvent(
      new InventoryCreatedEvent(
        inventory.id,
        inventory.organizationId,
        inventory.branchId,
        inventory.productId
      )
    );

    return inventory;
  }

  public adjustStock(quantityDelta: number): void {
    const newQuantity = this._quantityOnHand + quantityDelta;

    if (newQuantity < 0) {
      throw new Error("Stock quantity cannot become negative.");
    }

    if (this._quantityReserved > newQuantity) {
      throw new Error(
        "Quantity on hand cannot be less than reserved quantity."
      );
    }

    this._quantityOnHand = newQuantity;

    this.addDomainEvent(
      new StockAdjustedEvent(
        this.id,
        this.organizationId,
        this.branchId,
        this.productId,
        quantityDelta,
        this._quantityOnHand
      )
    );
  }

  public reserve(quantity: number): void {
    if (quantity <= 0) {
      throw new Error("Reservation quantity must be greater than zero.");
    }

    const available = this._quantityOnHand - this._quantityReserved;

    if (quantity > available) {
      throw new Error("Insufficient available stock.");
    }

    this._quantityReserved += quantity;
  }

  public release(quantity: number): void {
    if (quantity <= 0) {
      throw new Error("Release quantity must be greater than zero.");
    }

    if (quantity > this._quantityReserved) {
      throw new Error("Release quantity cannot exceed reserved quantity.");
    }

    this._quantityReserved -= quantity;
  }

  public archive(): void {
    this._status = InventoryStatus.ARCHIVED;
  }

  public activate(): void {
    if (this._status === InventoryStatus.ARCHIVED) {
      throw new Error("Archived inventory cannot be activated.");
    }

    this._status = InventoryStatus.ACTIVE;
  }

  public deactivate(): void {
    if (this._status === InventoryStatus.ARCHIVED) {
      throw new Error("Archived inventory cannot be deactivated.");
    }

    this._status = InventoryStatus.INACTIVE;
  }

  get quantityOnHand(): number {
    return this._quantityOnHand;
  }

  get quantityReserved(): number {
    return this._quantityReserved;
  }

  get quantityAvailable(): number {
    return this._quantityOnHand - this._quantityReserved;
  }

  get reorderLevel(): number {
    return this._reorderLevel;
  }

  get status(): InventoryStatus {
    return this._status;
  }
}
