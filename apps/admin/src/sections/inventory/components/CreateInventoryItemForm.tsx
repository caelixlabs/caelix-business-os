'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCreateInventoryItem } from '@/features/inventory/api/use-inventory';
import { createInventoryItemSchema, type CreateInventoryItemFormValues } from '@/features/inventory/schemas/inventory.schema';
import { useProducts } from '@/features/products/api/use-products';
import { useBranches } from '@/features/branches/api/use-branches';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';

export function CreateInventoryItemForm({ organizationId, onDone }: { organizationId: string; onDone: () => void }) {
  const createItem = useCreateInventoryItem(organizationId);
  const { data: products } = useProducts(organizationId);
  const { data: branches } = useBranches(organizationId);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateInventoryItemFormValues>({ resolver: zodResolver(createInventoryItemSchema) });

  const productId = watch('productId');
  const branchId = watch('branchId');

  return (
    <form onSubmit={handleSubmit((values) => createItem.mutate(values, { onSuccess: onDone }))} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-text">Product</span>
        <Select value={productId ?? ''} onValueChange={(value) => setValue('productId', value, { shouldValidate: true })}>
          <SelectTrigger>{products?.find((p) => p.id === productId)?.name ?? 'Select a product'}</SelectTrigger>
          <SelectContent>
            {(products ?? []).map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.productId && <p className="text-xs text-danger">{errors.productId.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-text">Branch</span>
        <Select value={branchId ?? ''} onValueChange={(value) => setValue('branchId', value, { shouldValidate: true })}>
          <SelectTrigger>{branches?.find((b) => b.id === branchId)?.name ?? 'Select a branch'}</SelectTrigger>
          <SelectContent>
            {(branches ?? []).map((branch) => (
              <SelectItem key={branch.id} value={branch.id}>
                {branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.branchId && <p className="text-xs text-danger">{errors.branchId.message}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Opening quantity" htmlFor="quantityOnHand" hint="Defaults to 0" error={errors.quantityOnHand?.message}>
          <Input id="quantityOnHand" type="number" min={0} {...register('quantityOnHand')} />
        </Field>
        <Field label="Reorder level" htmlFor="reorderLevel" hint="Defaults to 0" error={errors.reorderLevel?.message}>
          <Input id="reorderLevel" type="number" min={0} {...register('reorderLevel')} />
        </Field>
      </div>

      <Button type="submit" loading={createItem.isPending}>
        Create stock record
      </Button>
    </form>
  );
}
