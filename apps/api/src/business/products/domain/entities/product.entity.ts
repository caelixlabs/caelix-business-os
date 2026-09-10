import { AggregateRoot } from "@/common/ddd";

import { ProductStatus, ProductType } from "../enums";

import { ProductCreatedEvent } from "../events";

export interface CreateProductProps {
    id: string;
    organizationId: string;
    name: string;
    code: string;
    description?: string;
    type: ProductType;
    price: number;
    currency?: string;
    taxRate?: number;
}

export class Product extends AggregateRoot<string> {
    private _name: string;
    private readonly _code: string;
    private _description?: string;
    private readonly _type: ProductType;
    private _status: ProductStatus;
    private _price: number;
    private _currency: string;
    private _taxRate?: number;

    constructor(
        id: string,
        public readonly organizationId: string,
        name: string,
        code: string,
        type: ProductType,
        status: ProductStatus,
        price: number,
        currency: string,
        taxRate?: number,
        description?: string
    ) {
        super(id);

        this._name = name;
        this._code = code;
        this._type = type;
        this._status = status;
        this._price = price;
        this._currency = currency;
        this._taxRate = taxRate;
        this._description = description;
    }

    public static create(props: CreateProductProps): Product {
        const name = props.name.trim();

        const code = props.code.trim().toUpperCase();

        if (!name) {
            throw new Error("Product name is required.");
        }

        if (!code) {
            throw new Error("Product code is required.");
        }

        if (props.price < 0) {
            throw new Error("Product price cannot be negative.");
        }

        if (
            props.taxRate !== undefined &&
            (props.taxRate < 0 || props.taxRate > 100)
        ) {
            throw new Error("Product tax rate must be between 0 and 100.");
        }

        const product = new Product(
            props.id,
            props.organizationId,
            name,
            code,
            props.type,
            ProductStatus.ACTIVE,
            props.price,
            props.currency ?? "INR",
            props.taxRate,
            props.description?.trim()
        );

        product.addDomainEvent(
            new ProductCreatedEvent(
                product.id,
                product.organizationId,
                product.name,
            ),
        );

        return product;
    }

    public updateDetails(props: {
        name?: string;
        description?: string;
        price?: number;
        currency?: string;
        taxRate?: number;
    }): void {
        if (props.name !== undefined) {
            const name = props.name.trim();

            if (!name) {
                throw new Error("Product name is required.");
            }

            this._name = name;
        }

        if (props.description !== undefined) {
            this._description = props.description.trim();
        }

        if (props.price !== undefined) {
            if (props.price < 0) {
                throw new Error("Product price cannot be negative.");
            }

            this._price = props.price;
        }

        if (props.currency !== undefined) {
            this._currency = props.currency.trim().toUpperCase();
        }

        if (props.taxRate !== undefined) {
            if (props.taxRate < 0 || props.taxRate > 100) {
                throw new Error("Product tax rate must be between 0 and 100.");
            }

            this._taxRate = props.taxRate;
        }
    }

    public deactivate(): void {
        if (this._status === ProductStatus.ARCHIVED) {
            throw new Error("Archived product cannot be deactivated.");
        }

        this._status = ProductStatus.INACTIVE;
    }

    public activate(): void {
        if (this._status === ProductStatus.ARCHIVED) {
            throw new Error("Archived product cannot be activated.");
        }

        this._status = ProductStatus.ACTIVE;
    }

    public archive(): void {
        this._status = ProductStatus.ARCHIVED;
    }

    get name(): string {
        return this._name;
    }

    get code(): string {
        return this._code;
    }

    get description(): string | undefined {
        return this._description;
    }

    get type(): ProductType {
        return this._type;
    }

    get status(): ProductStatus {
        return this._status;
    }

    get price(): number {
        return this._price;
    }

    get currency(): string {
        return this._currency;
    }

    get taxRate(): number | undefined {
        return this._taxRate;
    }
}
