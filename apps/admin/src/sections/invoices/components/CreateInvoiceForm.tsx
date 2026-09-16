'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCreateInvoice } from '@/features/invoices/api/use-invoices';
import { createInvoiceSchema, type CreateInvoiceFormValues } from '@/features/invoices/schemas/invoice.schema';
import { useContacts } from '@/features/contacts/api/use-contacts';
import { useProducts } from '@/features/products/api/use-products';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Trash2 } from 'lucide-react';

export function CreateInvoiceForm({ organizationId, onDone }: { organizationId: string; onDone: () => void }) {
  const createInvoice = useCreateInvoice(organizationId);
  const { data: contacts } = useContacts(organizationId);
  const { data: products } = useProducts(organizationId);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<CreateInvoiceFormValues>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: { lines: [{ description: '', quantity: 1, unitPrice: 0 }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'lines' });

  const contactId = watch('contactId');
  const lines = watch('lines');
  const discountAmount = watch('discountAmount');

  const contactLabel = (id: string) => {
    const contact = contacts?.find((c) => c.id === id);
    if (!contact) return undefined;
    return contact.type === 'BUSINESS'
      ? contact.companyName
      : `${contact.firstName ?? ''} ${contact.lastName ?? ''}`.trim();
  };

  const subtotal = (lines ?? []).reduce((sum, line) => sum + (Number(line.quantity) || 0) * (Number(line.unitPrice) || 0), 0);
  const taxTotal = (lines ?? []).reduce((sum, line) => {
    const base = (Number(line.quantity) || 0) * (Number(line.unitPrice) || 0);
    const rate = Number(line.taxRate) || 0;
    return sum + base * (rate / 100);
  }, 0);
  const total = Math.max(0, subtotal - (Number(discountAmount) || 0) + taxTotal);

  return (
    <form
      onSubmit={handleSubmit((values) =>
        createInvoice.mutate({ ...values, dueDate: values.dueDate || undefined }, { onSuccess: onDone }),
      )}
      className="flex max-h-[75vh] flex-col gap-4 overflow-y-auto pr-1"
    >
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-text">Contact</span>
        <Select value={contactId ?? ''} onValueChange={(value) => setValue('contactId', value, { shouldValidate: true })}>
          <SelectTrigger>{contactLabel(contactId) ?? 'Select a contact'}</SelectTrigger>
          <SelectContent>
            {(contacts ?? []).map((contact) => (
              <SelectItem key={contact.id} value={contact.id}>
                {contact.type === 'BUSINESS'
                  ? contact.companyName
                  : `${contact.firstName ?? ''} ${contact.lastName ?? ''}`.trim()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.contactId && <p className="text-xs text-danger">{errors.contactId.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-text">Line items</span>
          <Button
            type="button"
            variant="secondary"
            className="!h-8 !px-2.5 text-xs"
            onClick={() => append({ description: '', quantity: 1, unitPrice: 0 })}
          >
            Add line
          </Button>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-12 gap-2 rounded-lg border border-border p-3">
            <div className="col-span-12 sm:col-span-4">
              <select
                className="h-9 w-full rounded-md border border-border bg-surface px-2 text-xs text-text outline-none focus:border-accent"
                defaultValue=""
                onChange={(event) => {
                  const product = products?.find((p) => p.id === event.target.value);
                  if (product) {
                    setValue(`lines.${index}.productId`, product.id);
                    setValue(`lines.${index}.description`, product.name);
                    setValue(`lines.${index}.unitPrice`, product.price);
                    if (product.taxRate) setValue(`lines.${index}.taxRate`, product.taxRate);
                  }
                }}
              >
                <option value="">From catalogue (optional)</option>
                {(products ?? []).map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
              <Input placeholder="Description" className="mt-1.5 !h-9 text-xs" {...register(`lines.${index}.description`)} />
              {errors.lines?.[index]?.description && (
                <p className="mt-1 text-xs text-danger">{errors.lines[index]?.description?.message}</p>
              )}
            </div>
            <div className="col-span-4 sm:col-span-2">
              <Field label="Qty" htmlFor={`qty-${index}`}>
                <Input id={`qty-${index}`} type="number" step="0.01" min={0.01} className="!h-9" {...register(`lines.${index}.quantity`)} />
              </Field>
            </div>
            <div className="col-span-4 sm:col-span-2">
              <Field label="Price" htmlFor={`price-${index}`}>
                <Input id={`price-${index}`} type="number" step="0.01" min={0} className="!h-9" {...register(`lines.${index}.unitPrice`)} />
              </Field>
            </div>
            <div className="col-span-3 sm:col-span-2">
              <Field label="Tax %" htmlFor={`tax-${index}`}>
                <Input id={`tax-${index}`} type="number" min={0} max={100} className="!h-9" {...register(`lines.${index}.taxRate`)} />
              </Field>
            </div>
            <div className="col-span-1 sm:col-span-2 flex items-end justify-end">
              <Button
                type="button"
                variant="ghost"
                className="!h-9 !w-9 !px-0 text-danger"
                disabled={fields.length === 1}
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        {errors.lines && typeof errors.lines.message === 'string' && (
          <p className="text-xs text-danger">{errors.lines.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Discount" htmlFor="discountAmount" hint="Flat amount, optional" error={errors.discountAmount?.message}>
          <Input id="discountAmount" type="number" min={0} step="0.01" {...register('discountAmount')} />
        </Field>
        <Field label="Due date" htmlFor="dueDate" hint="Optional" error={errors.dueDate?.message}>
          <Input id="dueDate" type="date" {...register('dueDate')} />
        </Field>
      </div>

      <Field label="Notes" htmlFor="notes" error={errors.notes?.message}>
        <Input id="notes" {...register('notes')} />
      </Field>

      <div className="rounded-lg bg-canvas p-3 text-sm">
        <div className="flex justify-between text-text-secondary">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-text-secondary">
          <span>Tax</span>
          <span>₹{taxTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-text-secondary">
          <span>Discount</span>
          <span>−₹{(Number(discountAmount) || 0).toFixed(2)}</span>
        </div>
        <div className="mt-1.5 flex justify-between border-t border-border pt-1.5 font-semibold text-text">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>

      <Button type="submit" loading={createInvoice.isPending}>
        Create invoice
      </Button>
    </form>
  );
}
