import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from "@nestjs/common";
import { customUUID } from "@/kernel/utility/uuid";
import { Product } from "../../domain/entities/product.entity";
import { type ProductRepository, PRODUCT_REPOSITORY } from "../../domain/repositories";

import { CreateProductDto } from "./create-product.dto";

@Injectable()
export class CreateProductHandler {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly repository: ProductRepository
  ) {}

  async execute(organizationId: string, dto: CreateProductDto): Promise<Product> {
    const existingCode = await this.repository.findByCode(
      organizationId,
      dto.code
    );

    if (existingCode) {
      throw new ConflictException(
        `Product code '${dto.code}' already exists in this organization.`
      );
    }

    const existingName = await this.repository.findByName(
      organizationId,
      dto.name
    );

    if (existingName) {
      throw new ConflictException(
        `Product '${dto.name}' already exists in this organization.`
      );
    }

    if (dto.price < 0) {
      throw new BadRequestException("Product price cannot be negative.");
    }

    const product = Product.create({
      id: customUUID.generate(),

      organizationId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      type: dto.type,
      price: dto.price,
      currency: dto.currency,
      taxRate: dto.taxRate,
    });

    return this.repository.create(product);
  }
}
