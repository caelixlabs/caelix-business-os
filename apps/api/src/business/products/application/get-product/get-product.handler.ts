import { Inject, Injectable } from "@nestjs/common";
import { EntityNotFoundException } from "@/common/framework/exceptions";
import { type ProductRepository, PRODUCT_REPOSITORY } from "../../domain/repositories";
import { GetProductQuery } from "./get-product.query";

@Injectable()
export class GetProductHandler {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly repository: ProductRepository
  ) {}

  async execute(query: GetProductQuery) {
    const product = await this.repository.findById(query.id);

    if (!product || product.organizationId !== query.organizationId) {
      throw new EntityNotFoundException("Product", query.id);
    }

    return product;
  }
}
