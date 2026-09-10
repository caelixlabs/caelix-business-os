import type { Product as PrismaProduct } from "@caelix-business-os/database";
import {
  ProductStatus as PrismaProductStatus,
  ProductType as PrismaProductType,
} from "@caelix-business-os/database";
import { Product } from "../domain/entities/product.entity";
import { ProductStatus, ProductType } from "../domain/enums";

export class ProductMapper {
  static toDomain(model: PrismaProduct): Product {
    return new Product(
      model.id,
      model.organizationId,
      model.name,
      model.code,
      model.type as ProductType,
      model.status as ProductStatus,
      Number(model.price),
      model.currency,
      model.taxRate !== null ? Number(model.taxRate) : undefined,
      model.description ?? undefined
    );
  }

  static toPersistence(product: Product) {
    return {
      id: product.id,
      organizationId: product.organizationId,
      name: product.name,
      code: product.code,
      description: product.description,
      type: product.type as PrismaProductType,
      status: product.status as PrismaProductStatus,
      price: product.price,
      currency: product.currency,
      taxRate: product.taxRate,
    };
  }
}
