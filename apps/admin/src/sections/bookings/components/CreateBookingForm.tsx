'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCreateBooking } from '@/features/bookings/api/use-bookings';
import { createBookingSchema, type CreateBookingFormValues } from '@/features/bookings/schemas/booking.schema';
import { useContacts } from '@/features/contacts/api/use-contacts';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';

export function CreateBookingForm({ organizationId, onDone }: { organizationId: string; onDone: () => void }) {
  const createBooking = useCreateBooking(organizationId);
  const { data: contacts } = useContacts(organizationId);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateBookingFormValues>({ resolver: zodResolver(createBookingSchema) });

  const contactId = watch('contactId');

  const contactLabel = (id: string) => {
    const contact = contacts?.find((c) => c.id === id);
    if (!contact) return undefined;
    return contact.type === 'BUSINESS'
      ? contact.companyName
      : `${contact.firstName ?? ''} ${contact.lastName ?? ''}`.trim();
  };

  return (
    <form
      onSubmit={handleSubmit((values) =>
        createBooking.mutate(
          { ...values, scheduledAt: new Date(values.scheduledAt).toISOString() },
          { onSuccess: onDone },
        ),
      )}
      className="flex flex-col gap-4"
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

      <Field label="Date & time" htmlFor="scheduledAt" error={errors.scheduledAt?.message}>
        <Input id="scheduledAt" type="datetime-local" {...register('scheduledAt')} />
      </Field>

      <Field label="Notes" htmlFor="notes" error={errors.notes?.message}>
        <Input id="notes" {...register('notes')} />
      </Field>

      <Button type="submit" loading={createBooking.isPending}>
        Create booking
      </Button>
    </form>
  );
}
