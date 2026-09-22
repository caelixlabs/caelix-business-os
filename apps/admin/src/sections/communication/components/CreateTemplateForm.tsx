'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCreateTemplate } from '@/features/communication/api/use-communication';
import { createTemplateSchema, type CreateTemplateFormValues } from '@/features/communication/schemas/communication.schema';
import { CHANNEL_LABELS, type MessageChannel } from '@/features/communication/types';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';

const CHANNELS = Object.keys(CHANNEL_LABELS) as MessageChannel[];
const textareaClass =
  'w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text outline-none transition-colors placeholder:text-text-secondary focus:border-accent';

export function CreateTemplateForm({ organizationId, onDone }: { organizationId: string; onDone: () => void }) {
  const create = useCreateTemplate(organizationId);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<CreateTemplateFormValues>({
    resolver: zodResolver(createTemplateSchema),
    defaultValues: { channel: 'EMAIL' },
  });
  const channel = useWatch({ control, name: 'channel' });

  return (
    <form onSubmit={handleSubmit((values) => create.mutate(values, { onSuccess: onDone }))} className="flex flex-col gap-4">
      <Field label="Template name" htmlFor="name" error={errors.name?.message}>
        <Input id="name" autoFocus placeholder="e.g. Appointment reminder" {...register('name')} />
      </Field>

      <Field label="Channel" htmlFor="channel">
        <Select value={channel} onValueChange={(value) => setValue('channel', value as MessageChannel)}>
          <SelectTrigger id="channel">{CHANNEL_LABELS[channel]}</SelectTrigger>
          <SelectContent>
            {CHANNELS.map((item) => (
              <SelectItem key={item} value={item}>
                {CHANNEL_LABELS[item]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      {channel === 'EMAIL' && (
        <Field label="Subject" htmlFor="subject">
          <Input id="subject" {...register('subject')} />
        </Field>
      )}

      <Field label="Message" htmlFor="body" error={errors.body?.message} hint="Use {{contactName}} to insert the contact's name.">
        <textarea id="body" rows={4} className={textareaClass} {...register('body')} />
      </Field>

      <Button type="submit" loading={create.isPending}>
        Save template
      </Button>
    </form>
  );
}
