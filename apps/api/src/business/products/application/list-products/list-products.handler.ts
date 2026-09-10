import { Inject, Injectable } from "@nestjs/common";
import { type ProductRepository, PRODUCT_REPOSITORY } from "../../domain/repositories";
import { ListProductsQuery } from "./list-products.query";

@Injectable()
export class ListProductsHandler {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly repository: ProductRepository
  ) {}

  execute(query: ListProductsQuery) {
    return this.repository.findByOrganization(query.organizationId);
  }
}
