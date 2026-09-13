import { Product } from "../../domain/entities/product.entity";

export class ProductResponseDto {
  id!: string;
  organizationId!: string;
  name!: string;
  code!: string;
  description?: string;
  type!: string;
  status!: string;
  price!: number;
  currency!: string;
  taxRate?: number;

  static fromDomain(product: Product): ProductResponseDto {
    const dto = new ProductResponseDto();
    dto.id = product.id;
    dto.organizationId = product.organizationId;
    dto.name = product.name;
    dto.code = product.code;
    dto.description = product.description;
    dto.type = product.type;
    dto.status = product.status;
    dto.price = product.price;
    dto.currency = product.currency;
    dto.taxRate = product.taxRate;
    return dto;
  }

  static fromDomainList(products: Product[]): ProductResponseDto[] {
    return products.map((product) => ProductResponseDto.fromDomain(product));
  }
}
