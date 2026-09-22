'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useContacts } from '@/features/contacts/api/use-contacts';
import { useChannelStatus, useMessageTemplates, useSendMessage } from '@/features/communication/api/use-communication';
import { sendMessageSchema, type SendMessageFormValues } from '@/features/communication/schemas/communication.schema';
import { CHANNEL_LABELS, type MessageChannel } from '@/features/communication/types';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';

const CHANNELS = Object.keys(CHANNEL_LABELS) as MessageChannel[];
const textareaClass =
  'w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text outline-none transition-colors placeholder:text-text-secondary focus:border-accent';

export function SendMessageForm({ organizationId, onDone }: { organizationId: string; onDone: () => void }) {
  const { data: contacts } = useContacts(organizationId);
  const { data: templates } = useMessageTemplates(organizationId);
  const { data: channelStatus } = useChannelStatus(organizationId);
  const send = useSendMessage(organizationId);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<SendMessageFormValues>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: { channel: 'EMAIL', contactId: '' },
  });

  const [channel, contactId] = useWatch({ control, name: ['channel', 'contactId'] });
  const contact = contacts?.find((item) => item.id === contactId);
  const channelTemplates = templates?.filter((template) => template.channel === channel) ?? [];
  const contactName = (item: NonNullable<typeof contact>) =>
    [item.firstName, item.lastName].filter(Boolean).join(' ') || item.companyName || item.email || 'Unnamed';

  return (
    <form onSubmit={handleSubmit((values) => send.mutate(values, { onSuccess: onDone }))} className="flex flex-col gap-4">
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
      {channelStatus && !channelStatus[channel] && (
        <p className="-mt-2 rounded-lg bg-canvas px-3 py-2 text-xs text-text-secondary">
          {CHANNEL_LABELS[channel]} isn&apos;t connected yet, so this message will be recorded but not delivered.
        </p>
      )}

      <Field label="To" htmlFor="contactId" error={errors.contactId?.message}>
        <Select value={contactId || 'unset'} onValueChange={(value) => setValue('contactId', value, { shouldValidate: true })}>
          <SelectTrigger id="contactId">{contact ? contactName(contact) : 'Choose a contact'}</SelectTrigger>
          <SelectContent>
            {(contacts ?? []).map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {contactName(item)}
                {channel === 'EMAIL' ? (item.email ? ` · ${item.email}` : ' · no email') : item.phone ? ` · ${item.phone}` : ' · no phone'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      {channelTemplates.length > 0 && (
        <Field label="Start from a template (optional)" htmlFor="template">
          <Select
            value="unset"
            onValueChange={(id) => {
              const template = channelTemplates.find((item) => item.id === id);
              if (!template) return;
              setValue('subject', template.subject ?? '');
              setValue('body', template.body, { shouldValidate: true });
            }}
          >
            <SelectTrigger id="template">Choose a template</SelectTrigger>
            <SelectContent>
              {channelTemplates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      )}

      {channel === 'EMAIL' && (
        <Field label="Subject" htmlFor="subject">
          <Input id="subject" {...register('subject')} />
        </Field>
      )}

      <Field label="Message" htmlFor="body" error={errors.body?.message} hint="Use {{contactName}} to insert the contact's name.">
        <textarea id="body" rows={4} className={textareaClass} {...register('body')} />
      </Field>

      <Button type="submit" loading={send.isPending}>
        Send message
      </Button>
    </form>
  );
}
