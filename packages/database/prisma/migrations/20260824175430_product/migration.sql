-- CreateEnum
CREATE TYPE "ContactType" AS ENUM ('PERSON', 'BUSINESS');

-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('PRODUCT', 'SERVICE');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateTable
CREATE TABLE "Contact" (
    "id" CHAR(32) NOT NULL,
    "organizationId" TEXT NOT NULL,
    "branchId" TEXT,
    "type" "ContactType" NOT NULL,
    "status" "ContactStatus" NOT NULL DEFAULT 'ACTIVE',
    "firstName" TEXT,
    "lastName" TEXT,
    "companyName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" CHAR(32) NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "type" "ProductType" NOT NULL,
    "status" "ProductStatus" NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "taxRate" DECIMAL(5,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Contact_organizationId_idx" ON "Contact"("organizationId");

-- CreateIndex
CREATE INDEX "Contact_organizationId_branchId_idx" ON "Contact"("organizationId", "branchId");

-- CreateIndex
CREATE INDEX "Contact_organizationId_status_idx" ON "Contact"("organizationId", "status");

-- CreateIndex
CREATE INDEX "Contact_organizationId_email_idx" ON "Contact"("organizationId", "email");

-- CreateIndex
CREATE INDEX "Contact_organizationId_phone_idx" ON "Contact"("organizationId", "phone");

-- CreateIndex
CREATE INDEX "Product_organizationId_idx" ON "Product"("organizationId");

-- CreateIndex
CREATE INDEX "Product_organizationId_status_idx" ON "Product"("organizationId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Product_organizationId_code_key" ON "Product"("organizationId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "Product_organizationId_name_key" ON "Product"("organizationId", "name");

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
