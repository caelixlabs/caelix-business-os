'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useContacts } from '@/features/contacts/api/use-contacts';
import { useRequestSignature } from '@/features/signatures/api/use-signatures';
import { requestSignatureSchema, type RequestSignatureFormValues } from '@/features/signatures/schemas/signature.schema';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';

const textareaClass =
  'w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text outline-none transition-colors placeholder:text-text-secondary focus:border-accent';

export function RequestSignatureForm({ organizationId, onDone }: { organizationId: string; onDone: () => void }) {
  const { data: contacts } = useContacts(organizationId);
  const request = useRequestSignature(organizationId);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<RequestSignatureFormValues>({
    resolver: zodResolver(requestSignatureSchema),
    defaultValues: { expiresInDays: 14 },
  });
  const contactId = useWatch({ control, name: 'contactId' });
  const contact = contacts?.find((item) => item.id === contactId);

  function pickContact(id: string) {
    const picked = contacts?.find((item) => item.id === id);
    setValue('contactId', id);
    if (!picked) return;
    setValue('signerName', [picked.firstName, picked.lastName].filter(Boolean).join(' ') || picked.companyName || '');
    setValue('signerEmail', picked.email ?? '', { shouldValidate: Boolean(picked.email) });
  }

  return (
    <form onSubmit={handleSubmit((values) => request.mutate(values, { onSuccess: onDone }))} className="flex flex-col gap-4">
      <Field label="Contact (optional)" htmlFor="contact" hint="Pick someone to fill in their name and email.">
        <Select value={contactId || 'unset'} onValueChange={pickContact}>
          <SelectTrigger id="contact">
            {contact ? [contact.firstName, contact.lastName].filter(Boolean).join(' ') || contact.companyName : 'Choose a contact'}
          </SelectTrigger>
          <SelectContent>
            {(contacts ?? []).map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {[item.firstName, item.lastName].filter(Boolean).join(' ') || item.companyName || item.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Signer name" htmlFor="signerName" error={errors.signerName?.message}>
          <Input id="signerName" {...register('signerName')} />
        </Field>
        <Field label="Signer email" htmlFor="signerEmail" error={errors.signerEmail?.message}>
          <Input id="signerEmail" type="email" {...register('signerEmail')} />
        </Field>
      </div>

      <Field label="Document title" htmlFor="title" error={errors.title?.message}>
        <Input id="title" placeholder="e.g. Treatment consent form" {...register('title')} />
      </Field>

      <Field label="Agreement text" htmlFor="body" error={errors.body?.message} hint="This exact wording is locked when you send it.">
        <textarea id="body" rows={6} className={textareaClass} {...register('body')} />
      </Field>

      <Field label="Link valid for (days)" htmlFor="expiresInDays" error={errors.expiresInDays?.message}>
        <Input id="expiresInDays" type="number" min={1} max={90} {...register('expiresInDays')} />
      </Field>

      <Button type="submit" loading={request.isPending}>
        Send for signature
      </Button>
    </form>
  );
}
