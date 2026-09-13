import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";

import { CurrentUser } from "@/core/auth/application/decorators";
import type { AccessTokenPayload } from "@/core/auth/application/services/token.service";
import { RequirePermissions } from "@/core/rbac/application/decorators";
import { PermissionCode } from "@/core/rbac/domain/enums";
import { assertSameOrganization } from "@/core/audit/guards/assert-same-organization";

import { CreateProductHandler } from "../../application/create-product/create-product.handler";
import { CreateProductDto } from "../../application/create-product/create-product.dto";
import { GetProductHandler } from "../../application/get-product/get-product.handler";
import { ListProductsHandler } from "../../application/list-products/list-products.handler";
import { UpdateProductHandler } from "../../application/update-product/update-product.handler";
import { UpdateProductDto } from "../../application/update-product/update-product.dto";
import { ArchiveProductHandler } from "../../application/archive-product/archive-product.handler";
import { ActivateProductHandler } from "../../application/activate-product/activate-product.handler";
import { DeactivateProductHandler } from "../../application/deactivate-product/deactivate-product.handler";
import { ProductResponseDto } from "../../application/dto/product-response.dto";

@Controller("organizations/:organizationId/products")
export class ProductController {
  constructor(
    private readonly createProductHandler: CreateProductHandler,
    private readonly getProductHandler: GetProductHandler,
    private readonly listProductsHandler: ListProductsHandler,
    private readonly updateProductHandler: UpdateProductHandler,
    private readonly archiveProductHandler: ArchiveProductHandler,
    private readonly activateProductHandler: ActivateProductHandler,
    private readonly deactivateProductHandler: DeactivateProductHandler,
  ) {}

  @Post()
  @RequirePermissions(PermissionCode.PRODUCT_CREATE)
  async create(
    @Param("organizationId") organizationId: string,
    @Body() dto: CreateProductDto,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const product = await this.createProductHandler.execute(organizationId, dto);
    return ProductResponseDto.fromDomain(product);
  }

  @Get()
  @RequirePermissions(PermissionCode.PRODUCT_READ)
  async list(
    @Param("organizationId") organizationId: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const products = await this.listProductsHandler.execute({ organizationId });
    return ProductResponseDto.fromDomainList(products);
  }

  @Get(":id")
  @RequirePermissions(PermissionCode.PRODUCT_READ)
  async get(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const product = await this.getProductHandler.execute({ organizationId, id });
    return ProductResponseDto.fromDomain(product);
  }

  @Patch(":id")
  @RequirePermissions(PermissionCode.PRODUCT_UPDATE)
  async update(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @Body() dto: UpdateProductDto,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const product = await this.updateProductHandler.execute(organizationId, id, dto);
    return ProductResponseDto.fromDomain(product);
  }

  @Patch(":id/archive")
  @RequirePermissions(PermissionCode.PRODUCT_ARCHIVE)
  async archive(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const product = await this.archiveProductHandler.execute(organizationId, id);
    return ProductResponseDto.fromDomain(product);
  }

  @Patch(":id/activate")
  @RequirePermissions(PermissionCode.PRODUCT_ARCHIVE)
  async activate(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const product = await this.activateProductHandler.execute(organizationId, id);
    return ProductResponseDto.fromDomain(product);
  }

  @Patch(":id/deactivate")
  @RequirePermissions(PermissionCode.PRODUCT_ARCHIVE)
  async deactivate(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const product = await this.deactivateProductHandler.execute(organizationId, id);
    return ProductResponseDto.fromDomain(product);
  }
}
