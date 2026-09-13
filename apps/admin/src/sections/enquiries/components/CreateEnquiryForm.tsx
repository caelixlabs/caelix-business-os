'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCreateEnquiry } from '@/features/enquiries/api/use-enquiries';
import { createEnquirySchema, enquirySourceValues, type CreateEnquiryFormValues } from '@/features/enquiries/schemas/enquiry.schema';
import { useContacts } from '@/features/contacts/api/use-contacts';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';

export function CreateEnquiryForm({ organizationId, onDone }: { organizationId: string; onDone: () => void }) {
  const createEnquiry = useCreateEnquiry(organizationId);
  const { data: contacts } = useContacts(organizationId);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateEnquiryFormValues>({
    resolver: zodResolver(createEnquirySchema),
    defaultValues: { source: 'WEBSITE' },
  });

  const contactId = watch('contactId');
  const source = watch('source');

  const contactLabel = (id: string) => {
    const contact = contacts?.find((c) => c.id === id);
    if (!contact) return undefined;
    return contact.type === 'BUSINESS'
      ? contact.companyName
      : `${contact.firstName ?? ''} ${contact.lastName ?? ''}`.trim();
  };

  return (
    <form
      onSubmit={handleSubmit((values) => createEnquiry.mutate(values, { onSuccess: onDone }))}
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

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-text">Source</span>
        <Select value={source} onValueChange={(value) => setValue('source', value as CreateEnquiryFormValues['source'])}>
          <SelectTrigger>{source}</SelectTrigger>
          <SelectContent>
            {enquirySourceValues.map((value) => (
              <SelectItem key={value} value={value}>
                {value.replace('_', ' ').toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Field label="Subject" htmlFor="subject" error={errors.subject?.message}>
        <Input id="subject" autoFocus {...register('subject')} />
      </Field>

      <Field label="Description" htmlFor="description" error={errors.description?.message}>
        <Input id="description" {...register('description')} />
      </Field>

      <Button type="submit" loading={createEnquiry.isPending}>
        Log enquiry
      </Button>
    </form>
  );
}
