import { Module } from "@nestjs/common";
import { PRODUCT_REPOSITORY } from "./domain/repositories";
import { ProductPrismaRepository } from "./infrastructure/prisma/product.prisma.repository";
import { CreateProductHandler } from "./application/create-product/create-product.handler";
import { GetProductHandler } from "./application/get-product/get-product.handler";
import { ListProductsHandler } from "./application/list-products/list-products.handler";
import { UpdateProductHandler } from "./application/update-product/update-product.handler";
import { ArchiveProductHandler } from "./application/archive-product/archive-product.handler";
import { ActivateProductHandler } from "./application/activate-product/activate-product.handler";
import { DeactivateProductHandler } from "./application/deactivate-product/deactivate-product.handler";
import { ProductController } from "./presentation/controllers/product.controller";

@Module({
  controllers: [ProductController],

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
    ActivateProductHandler,
    DeactivateProductHandler,
  ],

  exports: [
    PRODUCT_REPOSITORY,
    CreateProductHandler,
    GetProductHandler,
    ListProductsHandler,
    UpdateProductHandler,
    ArchiveProductHandler,
    ActivateProductHandler,
    DeactivateProductHandler,
  ],
})
export class ProductsModule {}
