import { BadRequestException, Inject, Injectable } from "@nestjs/common";

import { EntityNotFoundException } from "@/common/framework/exceptions";

import { type ProductRepository, PRODUCT_REPOSITORY } from "../../domain/repositories";

import { UpdateProductDto } from "./update-product.dto";

@Injectable()
export class UpdateProductHandler {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly repository: ProductRepository
  ) {}

  async execute(
    organizationId: string,

    productId: string,

    dto: UpdateProductDto
  ) {
    const product = await this.repository.findById(productId);

    if (!product || product.organizationId !== organizationId) {
      throw new EntityNotFoundException("Product", productId);
    }

    if (dto.price !== undefined && dto.price < 0) {
      throw new BadRequestException("Product price cannot be negative.");
    }

    product.updateDetails(dto);

    return this.repository.update(product);
  }
}
