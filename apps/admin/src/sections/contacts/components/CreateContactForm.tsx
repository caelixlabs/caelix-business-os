'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCreateContact } from '@/features/contacts/api/use-contacts';
import { createContactSchema, type CreateContactFormValues } from '@/features/contacts/schemas/contact.schema';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';

export function CreateContactForm({ organizationId, onDone }: { organizationId: string; onDone: () => void }) {
  const createContact = useCreateContact(organizationId);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateContactFormValues>({
    resolver: zodResolver(createContactSchema),
    defaultValues: { type: 'PERSON' },
  });

  const type = watch('type');

  return (
    <form
      onSubmit={handleSubmit((values) =>
        createContact.mutate({ ...values, email: values.email || undefined }, { onSuccess: onDone }),
      )}
      className="flex flex-col gap-4"
    >
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setValue('type', 'PERSON')}
          className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
            type === 'PERSON' ? 'border-accent bg-accent-soft text-accent-ink' : 'border-border text-text-secondary'
          }`}
        >
          Person
        </button>
        <button
          type="button"
          onClick={() => setValue('type', 'BUSINESS')}
          className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
            type === 'BUSINESS' ? 'border-accent bg-accent-soft text-accent-ink' : 'border-border text-text-secondary'
          }`}
        >
          Business
        </button>
      </div>

      {type === 'BUSINESS' ? (
        <Field label="Company name" htmlFor="companyName" error={errors.companyName?.message}>
          <Input id="companyName" autoFocus {...register('companyName')} />
        </Field>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First name" htmlFor="firstName" error={errors.firstName?.message}>
            <Input id="firstName" autoFocus {...register('firstName')} />
          </Field>
          <Field label="Last name" htmlFor="lastName" error={errors.lastName?.message}>
            <Input id="lastName" {...register('lastName')} />
          </Field>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" {...register('email')} />
        </Field>
        <Field label="Phone" htmlFor="phone" error={errors.phone?.message}>
          <Input id="phone" {...register('phone')} />
        </Field>
      </div>

      <Field label="Notes" htmlFor="notes" error={errors.notes?.message}>
        <Input id="notes" {...register('notes')} />
      </Field>

      <Button type="submit" loading={createContact.isPending}>
        Add contact
      </Button>
    </form>
  );
}
