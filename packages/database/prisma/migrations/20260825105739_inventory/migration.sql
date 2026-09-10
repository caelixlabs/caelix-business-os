-- CreateEnum
CREATE TYPE "InventoryStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateTable
CREATE TABLE "InventoryItem" (
    "id" CHAR(32) NOT NULL,
    "organizationId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantityOnHand" INTEGER NOT NULL DEFAULT 0,
    "quantityReserved" INTEGER NOT NULL DEFAULT 0,
    "reorderLevel" INTEGER NOT NULL DEFAULT 0,
    "status" "InventoryStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InventoryItem_organizationId_idx" ON "InventoryItem"("organizationId");

-- CreateIndex
CREATE INDEX "InventoryItem_organizationId_branchId_idx" ON "InventoryItem"("organizationId", "branchId");

-- CreateIndex
CREATE INDEX "InventoryItem_organizationId_productId_idx" ON "InventoryItem"("organizationId", "productId");

-- CreateIndex
CREATE INDEX "InventoryItem_branchId_productId_idx" ON "InventoryItem"("branchId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryItem_organizationId_branchId_productId_key" ON "InventoryItem"("organizationId", "branchId", "productId");

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
