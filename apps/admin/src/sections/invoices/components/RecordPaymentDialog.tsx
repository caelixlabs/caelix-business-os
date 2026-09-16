'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useRecordPayment } from '@/features/invoices/api/use-invoices';
import { recordPaymentSchema, paymentMethodValues, type RecordPaymentFormValues } from '@/features/invoices/schemas/invoice.schema';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Field, Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';

export function RecordPaymentDialog({
  organizationId,
  invoiceId,
  balanceDue,
}: {
  organizationId: string;
  invoiceId: string;
  balanceDue: number;
}) {
  const [open, setOpen] = useState(false);
  const recordPayment = useRecordPayment(organizationId, invoiceId);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<RecordPaymentFormValues>({
    resolver: zodResolver(recordPaymentSchema),
    defaultValues: { amount: balanceDue, paymentMethod: 'CASH' },
  });

  const paymentMethod = watch('paymentMethod');

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) reset({ amount: balanceDue, paymentMethod: 'CASH' });
      }}
    >
      <DialogTrigger asChild>
        <Button>Record payment</Button>
      </DialogTrigger>
      <DialogContent title="Record a payment" description={`Outstanding balance: ₹${balanceDue.toFixed(2)}`}>
        <form
          onSubmit={handleSubmit((values) =>
            recordPayment.mutate(
              { ...values, referenceId: values.referenceId || undefined },
              { onSuccess: () => setOpen(false) },
            ),
          )}
          className="flex flex-col gap-4"
        >
          <Field label="Amount" htmlFor="amount" error={errors.amount?.message}>
            <Input id="amount" type="number" step="0.01" min={0.01} autoFocus {...register('amount')} />
          </Field>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-text">Method</span>
            <Select value={paymentMethod} onValueChange={(value) => setValue('paymentMethod', value as RecordPaymentFormValues['paymentMethod'])}>
              <SelectTrigger>{paymentMethod}</SelectTrigger>
              <SelectContent>
                {paymentMethodValues.map((value) => (
                  <SelectItem key={value} value={value}>
                    {value.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Field label="Reference" htmlFor="referenceId" hint="Transaction ID or receipt no., optional" error={errors.referenceId?.message}>
            <Input id="referenceId" {...register('referenceId')} />
          </Field>

          <Button type="submit" loading={recordPayment.isPending}>
            Record payment
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
