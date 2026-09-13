'use client';

import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';

import { useOrganizationContext } from '@/contexts/organization/OrganizationContext';
import { useProducts, useToggleProductStatus } from '@/features/products/api/use-products';
import type { Product } from '@/features/products/types';
import { useInventory, useToggleInventoryStatus } from '@/features/inventory/api/use-inventory';
import type { InventoryItem } from '@/features/inventory/types';
import { useBranches } from '@/features/branches/api/use-branches';

import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data/data-table';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PermissionGate } from '@/core/access/components/permission-gate';
import { CreateProductForm } from './components/CreateProductForm';
import { CreateInventoryItemForm } from './components/CreateInventoryItemForm';
import { AdjustStockDialog } from './components/AdjustStockDialog';

const STATUS_TONE: Record<string, 'success' | 'neutral' | 'danger'> = {
  ACTIVE: 'success',
  INACTIVE: 'neutral',
  ARCHIVED: 'danger',
};

export function InventorySection() {
  const { organization } = useOrganizationContext();
  const organizationId = organization?.id;

  return (
    <div>
      <PageHeader title="Inventory" description="Products, services, and stock levels across your branches." />

      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="stock">Stock</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <ProductsTab organizationId={organizationId} />
        </TabsContent>

        <TabsContent value="stock">
          <StockTab organizationId={organizationId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProductsTab({ organizationId }: { organizationId: string | undefined }) {
  const { data: products, isLoading } = useProducts(organizationId);
  const toggleStatus = useToggleProductStatus(organizationId ?? '');
  const [dialogOpen, setDialogOpen] = useState(false);

  const columns: ColumnDef<Product, unknown>[] = [
    {
      accessorKey: 'name',
      header: 'Product',
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-text">{row.original.name}</p>
          <p className="font-mono text-xs text-text-secondary">{row.original.code}</p>
        </div>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ getValue }) => <Badge tone="info">{(getValue() as string).toLowerCase()}</Badge>,
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => `${row.original.currency} ${row.original.price.toFixed(2)}`,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return <Badge tone={STATUS_TONE[value] ?? 'neutral'}>{value.toLowerCase()}</Badge>;
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const product = row.original;
        return (
          <PermissionGate permission="product:archive">
            <div className="flex justify-end gap-1.5">
              {product.status !== 'ACTIVE' && (
                <Button
                  variant="ghost"
                  className="!px-2 !py-1 text-xs"
                  disabled={toggleStatus.isPending}
                  onClick={() => toggleStatus.mutate({ id: product.id, nextStatus: 'ACTIVE' })}
                >
                  Activate
                </Button>
              )}
              {product.status === 'ACTIVE' && (
                <Button
                  variant="ghost"
                  className="!px-2 !py-1 text-xs"
                  disabled={toggleStatus.isPending}
                  onClick={() => toggleStatus.mutate({ id: product.id, nextStatus: 'INACTIVE' })}
                >
                  Deactivate
                </Button>
              )}
              {product.status !== 'ARCHIVED' && (
                <Button
                  variant="ghost"
                  className="!px-2 !py-1 text-xs text-danger"
                  disabled={toggleStatus.isPending}
                  onClick={() => toggleStatus.mutate({ id: product.id, nextStatus: 'ARCHIVED' })}
                >
                  Archive
                </Button>
              )}
            </div>
          </PermissionGate>
        );
      },
    },
  ];

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <PermissionGate permission="product:create">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>New product</Button>
            </DialogTrigger>
            <DialogContent title="Create a product" description="Add a product or service to your catalogue.">
              {organizationId && <CreateProductForm organizationId={organizationId} onDone={() => setDialogOpen(false)} />}
            </DialogContent>
          </Dialog>
        </PermissionGate>
      </div>

      <DataTable
        columns={columns}
        data={products ?? []}
        loading={isLoading}
        searchPlaceholder="Search products..."
        emptyTitle="No products yet"
        emptyDescription="Add your first product or service."
      />
    </div>
  );
}

function StockTab({ organizationId }: { organizationId: string | undefined }) {
  const { data: items, isLoading } = useInventory(organizationId);
  const { data: products } = useProducts(organizationId);
  const { data: branches } = useBranches(organizationId);
  const toggleStatus = useToggleInventoryStatus(organizationId ?? '');
  const [dialogOpen, setDialogOpen] = useState(false);

  const productName = (id: string) => products?.find((p) => p.id === id)?.name ?? id;
  const branchName = (id: string) => branches?.find((b) => b.id === id)?.name ?? id;

  const columns: ColumnDef<InventoryItem, unknown>[] = [
    { id: 'product', header: 'Product', accessorFn: (row) => productName(row.productId) },
    { id: 'branch', header: 'Branch', accessorFn: (row) => branchName(row.branchId) },
    { accessorKey: 'quantityOnHand', header: 'On hand' },
    { accessorKey: 'quantityAvailable', header: 'Available' },
    {
      id: 'reorder',
      header: 'Reorder at',
      cell: ({ row }) => (
        <span className={row.original.quantityAvailable <= row.original.reorderLevel ? 'font-medium text-danger' : ''}>
          {row.original.reorderLevel}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return <Badge tone={STATUS_TONE[value] ?? 'neutral'}>{value.toLowerCase()}</Badge>;
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <PermissionGate permission="inventory:manage">
          <div className="flex justify-end gap-1.5">
            <AdjustStockDialog organizationId={organizationId ?? ''} itemId={row.original.id} />
            {row.original.status !== 'ARCHIVED' && (
              <Button
                variant="ghost"
                className="!px-2 !py-1 text-xs text-danger"
                disabled={toggleStatus.isPending}
                onClick={() => toggleStatus.mutate({ id: row.original.id, nextStatus: 'ARCHIVED' })}
              >
                Archive
              </Button>
            )}
          </div>
        </PermissionGate>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <PermissionGate permission="inventory:create">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>New stock record</Button>
            </DialogTrigger>
            <DialogContent title="Create a stock record" description="Track a product's stock at a branch.">
              {organizationId && <CreateInventoryItemForm organizationId={organizationId} onDone={() => setDialogOpen(false)} />}
            </DialogContent>
          </Dialog>
        </PermissionGate>
      </div>

      <DataTable
        columns={columns}
        data={items ?? []}
        loading={isLoading}
        searchPlaceholder="Search stock..."
        emptyTitle="No stock records yet"
        emptyDescription="Create a stock record to start tracking inventory."
      />
    </div>
  );
}
