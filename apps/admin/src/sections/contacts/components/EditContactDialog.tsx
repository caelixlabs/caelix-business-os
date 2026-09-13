'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import type { Contact } from '@/features/contacts/types';
import { useUpdateContact } from '@/features/contacts/api/use-contacts';
import { editContactSchema, type EditContactFormValues } from '@/features/contacts/schemas/contact.schema';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Field, Input } from '@/components/ui/input';

export function EditContactDialog({ contact, organizationId }: { contact: Contact; organizationId: string }) {
  const [open, setOpen] = useState(false);
  const updateContact = useUpdateContact(organizationId);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditContactFormValues>({
    resolver: zodResolver(editContactSchema),
    defaultValues: {
      firstName: contact.firstName,
      lastName: contact.lastName,
      companyName: contact.companyName,
      email: contact.email,
      phone: contact.phone,
      notes: contact.notes,
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="!px-2 !py-1 text-xs">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent title="Edit contact" description="Update this contact's details.">
        <form
          onSubmit={handleSubmit((values) =>
            updateContact.mutate(
              { id: contact.id, input: { ...values, email: values.email || undefined } },
              { onSuccess: () => setOpen(false) },
            ),
          )}
          className="flex flex-col gap-4"
        >
          {contact.type === 'BUSINESS' ? (
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

          <Button type="submit" loading={updateContact.isPending}>
            Save changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
