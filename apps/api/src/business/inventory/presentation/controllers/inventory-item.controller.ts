import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";

import { CurrentUser } from "@/core/auth/application/decorators";
import type { AccessTokenPayload } from "@/core/auth/application/services/token.service";
import { RequirePermissions } from "@/core/rbac/application/decorators";
import { PermissionCode } from "@/core/rbac/domain/enums";
import { assertSameOrganization } from "@/core/audit/guards/assert-same-organization";

import { CreateInventoryItemHandler } from "../../application/create-inventory-item/create-inventory-item.handler";
import { CreateInventoryItemDto } from "../../application/create-inventory-item/create-inventory-item.dto";
import { GetInventoryItemHandler } from "../../application/get-inventory-item/get-inventory-item.handler";
import { ListInventoryHandler } from "../../application/list-inventory/list-inventory.handler";
import { AdjustStockHandler } from "../../application/adjust-stock/adjust-stock.handler";
import { AdjustStockDto } from "../../application/adjust-stock/adjust-stock.dto";
import { ArchiveInventoryItemHandler } from "../../application/archive-inventory-item/archive-inventory-item.handler";
import { ActivateInventoryItemHandler } from "../../application/activate-inventory-item/activate-inventory-item.handler";
import { DeactivateInventoryItemHandler } from "../../application/deactivate-inventory-item/deactivate-inventory-item.handler";
import { InventoryItemResponseDto } from "../../application/dto/inventory-item-response.dto";

@Controller("organizations/:organizationId/inventory")
export class InventoryItemController {
  constructor(
    private readonly createInventoryItemHandler: CreateInventoryItemHandler,
    private readonly getInventoryItemHandler: GetInventoryItemHandler,
    private readonly listInventoryHandler: ListInventoryHandler,
    private readonly adjustStockHandler: AdjustStockHandler,
    private readonly archiveInventoryItemHandler: ArchiveInventoryItemHandler,
    private readonly activateInventoryItemHandler: ActivateInventoryItemHandler,
    private readonly deactivateInventoryItemHandler: DeactivateInventoryItemHandler,
  ) {}

  @Post()
  @RequirePermissions(PermissionCode.INVENTORY_CREATE)
  async create(
    @Param("organizationId") organizationId: string,
    @Body() dto: CreateInventoryItemDto,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const item = await this.createInventoryItemHandler.execute(organizationId, dto);
    return InventoryItemResponseDto.fromDomain(item);
  }

  @Get()
  @RequirePermissions(PermissionCode.INVENTORY_READ)
  async list(
    @Param("organizationId") organizationId: string,
    @Query("branchId") branchId: string | undefined,
    @Query("productId") productId: string | undefined,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const items = await this.listInventoryHandler.execute({ organizationId, branchId, productId });
    return InventoryItemResponseDto.fromDomainList(items);
  }

  @Get(":id")
  @RequirePermissions(PermissionCode.INVENTORY_READ)
  async get(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const item = await this.getInventoryItemHandler.execute({ organizationId, id });
    return InventoryItemResponseDto.fromDomain(item);
  }

  @Patch(":id/adjust-stock")
  @RequirePermissions(PermissionCode.INVENTORY_MANAGE)
  async adjustStock(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @Body() dto: AdjustStockDto,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const item = await this.adjustStockHandler.execute(organizationId, id, dto);
    return InventoryItemResponseDto.fromDomain(item);
  }

  @Patch(":id/archive")
  @RequirePermissions(PermissionCode.INVENTORY_MANAGE)
  async archive(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const item = await this.archiveInventoryItemHandler.execute(organizationId, id);
    return InventoryItemResponseDto.fromDomain(item);
  }

  @Patch(":id/activate")
  @RequirePermissions(PermissionCode.INVENTORY_MANAGE)
  async activate(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const item = await this.activateInventoryItemHandler.execute(organizationId, id);
    return InventoryItemResponseDto.fromDomain(item);
  }

  @Patch(":id/deactivate")
  @RequirePermissions(PermissionCode.INVENTORY_MANAGE)
  async deactivate(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const item = await this.deactivateInventoryItemHandler.execute(organizationId, id);
    return InventoryItemResponseDto.fromDomain(item);
  }
}
