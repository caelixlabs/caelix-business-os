'use client';

import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';

import { useOrganizationContext } from '@/contexts/organization/OrganizationContext';
import { useProducts } from '@/features/products/api/use-products';
import { useCheckout, useSales } from '@/features/pos/api/use-pos';
import type { CheckoutLineInput, PaymentMethod, Sale } from '@/features/pos/types';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data/data-table';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { EmptyState } from '@/components/ui/empty-state';
import { formatCurrency, formatDate } from '@/lib/format';

interface CartLine extends CheckoutLineInput {
  key: string;
  name: string;
}

const PAYMENT_METHODS: PaymentMethod[] = ['CASH', 'UPI', 'STRIPE', 'BANK_TRANSFER'];

export function PosSection() {
  const { organization } = useOrganizationContext();
  const organizationId = organization?.id;
  const { data: products } = useProducts(organizationId);
  const { data: sales, isLoading: salesLoading } = useSales(organizationId);
  const checkout = useCheckout(organizationId ?? '');

  const [cart, setCart] = useState<CartLine[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');

  const activeProducts = (products ?? []).filter((p) => p.status === 'ACTIVE');
  const total = cart.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);

  function addToCart(product: { id: string; name: string; price: number }) {
    setCart((prev) => {
      const existing = prev.find((line) => line.productId === product.id);
      if (existing) {
        return prev.map((line) =>
          line.productId === product.id ? { ...line, quantity: line.quantity + 1 } : line,
        );
      }
      return [...prev, { key: product.id, productId: product.id, name: product.name, quantity: 1, unitPrice: product.price }];
    });
  }

  function changeQty(key: string, delta: number) {
    setCart((prev) =>
      prev
        .map((line) => (line.key === key ? { ...line, quantity: Math.max(0, line.quantity + delta) } : line))
        .filter((line) => line.quantity > 0),
    );
  }

  function removeLine(key: string) {
    setCart((prev) => prev.filter((line) => line.key !== key));
  }

  function handleCheckout() {
    if (cart.length === 0) return;
    checkout.mutate(
      {
        paymentMethod,
        lines: cart.map(({ key: _key, name: _name, ...line }) => line),
      },
      { onSuccess: () => setCart([]) },
    );
  }

  const saleColumns: ColumnDef<Sale, unknown>[] = [
    { id: 'items', header: 'Items', accessorFn: (row) => row.lines.map((l) => l.description).join(', ') },
    { accessorKey: 'paymentMethod', header: 'Payment' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => (
        <Badge tone={getValue() === 'COMPLETED' ? 'success' : 'danger'}>{(getValue() as string).toLowerCase()}</Badge>
      ),
    },
    { accessorKey: 'totalAmount', header: 'Total', cell: ({ getValue }) => formatCurrency(getValue() as number) },
    { accessorKey: 'createdAt', header: 'When', cell: ({ getValue }) => formatDate(getValue() as string, 'relative') },
  ];

  return (
    <div>
      <PageHeader title="Point of sale" description="Ring up products and services on the spot." />

      <div className="mb-8 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {activeProducts.length === 0 ? (
            <EmptyState title="No products yet" description="Add a product from Inventory to sell it here." />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {activeProducts.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => addToCart(product)}
                  className="rounded-xl border border-border bg-surface p-4 text-left transition hover:border-accent/40 hover:shadow-sm"
                >
                  <p className="text-sm font-medium text-text">{product.name}</p>
                  <p className="mt-1 text-xs text-text-secondary">{formatCurrency(product.price)}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4">
          <div className="mb-3 flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-text-secondary" />
            <h3 className="text-sm font-semibold text-text">Cart</h3>
          </div>

          {cart.length === 0 ? (
            <p className="py-8 text-center text-xs text-text-secondary">Tap a product to add it.</p>
          ) : (
            <div className="mb-4 flex flex-col gap-3">
              {cart.map((line) => (
                <div key={line.key} className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-text">{line.name}</p>
                    <p className="text-xs text-text-secondary">{formatCurrency(line.unitPrice)} each</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => changeQty(line.key, -1)}
                      className="flex h-6 w-6 items-center justify-center rounded-md border border-border text-text-secondary hover:border-accent/40"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-4 text-center text-sm text-text">{line.quantity}</span>
                    <button
                      type="button"
                      onClick={() => changeQty(line.key, 1)}
                      className="flex h-6 w-6 items-center justify-center rounded-md border border-border text-text-secondary hover:border-accent/40"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeLine(line.key)}
                      className="ml-1 text-text-secondary hover:text-danger"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mb-3 flex items-center justify-between border-t border-border pt-3 text-sm">
            <span className="text-text-secondary">Total</span>
            <span className="font-semibold text-text">{formatCurrency(total)}</span>
          </div>

          <div className="mb-3 flex flex-col gap-1.5">
            <span className="text-xs font-medium text-text-secondary">Payment method</span>
            <Select value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
              <SelectTrigger>{paymentMethod}</SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full" disabled={cart.length === 0} loading={checkout.isPending} onClick={handleCheckout}>
            Charge {formatCurrency(total)}
          </Button>
        </div>
      </div>

      <h3 className="mb-3 text-sm font-semibold text-text">Recent sales</h3>
      <DataTable
        columns={saleColumns}
        data={sales ?? []}
        loading={salesLoading}
        searchPlaceholder="Search sales..."
        emptyTitle="No sales yet"
        emptyDescription="Completed sales will show up here."
      />
    </div>
  );
}
