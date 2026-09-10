import { Inject, Injectable } from "@nestjs/common";

import { EntityNotFoundException } from "@/common/framework/exceptions";

import { type ProductRepository, PRODUCT_REPOSITORY } from "../../domain/repositories";

@Injectable()
export class ArchiveProductHandler {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly repository: ProductRepository
  ) {}

  async execute(
    organizationId: string,

    productId: string
  ) {
    const product = await this.repository.findById(productId);

    if (!product || product.organizationId !== organizationId) {
      throw new EntityNotFoundException("Product", productId);
    }

    product.archive();

    return this.repository.update(product);
  }
}
