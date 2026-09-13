'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAdjustStock } from '@/features/inventory/api/use-inventory';
import { adjustStockSchema, type AdjustStockFormValues } from '@/features/inventory/schemas/inventory.schema';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Field, Input } from '@/components/ui/input';

export function AdjustStockDialog({ organizationId, itemId }: { organizationId: string; itemId: string }) {
  const [open, setOpen] = useState(false);
  const adjustStock = useAdjustStock(organizationId);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdjustStockFormValues>({ resolver: zodResolver(adjustStockSchema) });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="!px-2 !py-1 text-xs">
          Adjust stock
        </Button>
      </DialogTrigger>
      <DialogContent title="Adjust stock" description="Positive numbers add stock, negative numbers remove it.">
        <form
          onSubmit={handleSubmit((values) =>
            adjustStock.mutate(
              { id: itemId, quantityDelta: values.quantityDelta },
              {
                onSuccess: () => {
                  reset();
                  setOpen(false);
                },
              },
            ),
          )}
          className="flex flex-col gap-4"
        >
          <Field label="Quantity change" htmlFor="quantityDelta" hint="e.g. 10 or -5" error={errors.quantityDelta?.message}>
            <Input id="quantityDelta" type="number" autoFocus {...register('quantityDelta')} />
          </Field>

          <Button type="submit" loading={adjustStock.isPending}>
            Apply adjustment
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
