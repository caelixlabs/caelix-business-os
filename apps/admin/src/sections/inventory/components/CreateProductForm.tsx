'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCreateProduct } from '@/features/products/api/use-products';
import { createProductSchema, productTypeValues, type CreateProductFormValues } from '@/features/products/schemas/product.schema';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';

export function CreateProductForm({ organizationId, onDone }: { organizationId: string; onDone: () => void }) {
  const createProduct = useCreateProduct(organizationId);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: { type: 'PRODUCT' },
  });

  const type = watch('type');

  return (
    <form onSubmit={handleSubmit((values) => createProduct.mutate(values, { onSuccess: onDone }))} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" htmlFor="name" error={errors.name?.message}>
          <Input id="name" autoFocus {...register('name')} />
        </Field>
        <Field label="Code" htmlFor="code" hint="Unique SKU" error={errors.code?.message}>
          <Input id="code" {...register('code')} />
        </Field>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-text">Type</span>
        <Select value={type} onValueChange={(value) => setValue('type', value as CreateProductFormValues['type'])}>
          <SelectTrigger>{type === 'SERVICE' ? 'Service' : 'Product'}</SelectTrigger>
          <SelectContent>
            {productTypeValues.map((value) => (
              <SelectItem key={value} value={value}>
                {value.charAt(0) + value.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Price" htmlFor="price" error={errors.price?.message}>
          <Input id="price" type="number" min={0} step="0.01" {...register('price')} />
        </Field>
        <Field label="Tax rate %" htmlFor="taxRate" hint="Optional" error={errors.taxRate?.message}>
          <Input id="taxRate" type="number" min={0} max={100} {...register('taxRate')} />
        </Field>
      </div>

      <Field label="Description" htmlFor="description" error={errors.description?.message}>
        <Input id="description" {...register('description')} />
      </Field>

      <Button type="submit" loading={createProduct.isPending}>
        Create product
      </Button>
    </form>
  );
}
