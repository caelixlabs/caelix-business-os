import { Module } from "@nestjs/common";
import { PRODUCT_REPOSITORY } from "./domain/repositories";
import { ProductPrismaRepository } from "./infrastructure/prisma/product.prisma.repository";
import { CreateProductHandler } from "./application/create-product/create-product.handler";
import { GetProductHandler } from "./application/get-product/get-product.handler";
import { ListProductsHandler } from "./application/list-products/list-products.handler";
import { UpdateProductHandler } from "./application/update-product/update-product.handler";
import { ArchiveProductHandler } from "./application/archive-product/archive-product.handler";

@Module({
  providers: [
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductPrismaRepository,
    },
    CreateProductHandler,
    GetProductHandler,
    ListProductsHandler,
    UpdateProductHandler,
    ArchiveProductHandler,
  ],

  exports: [
    PRODUCT_REPOSITORY,
    CreateProductHandler,
    GetProductHandler,
    ListProductsHandler,
    UpdateProductHandler,
    ArchiveProductHandler,
  ],
})
export class ProductsModule {}
