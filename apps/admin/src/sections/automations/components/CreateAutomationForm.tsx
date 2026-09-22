'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAutomationTriggers, useCreateAutomation } from '@/features/automations/api/use-automations';
import { createAutomationSchema, type CreateAutomationFormValues } from '@/features/automations/schemas/automation.schema';
import { ACTION_LABELS, type AutomationActionType } from '@/features/automations/types';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';

const CONTACT_VARIABLES = ['contactName', 'contactEmail'];
const textareaClass =
  'w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text outline-none transition-colors placeholder:text-text-secondary focus:border-accent';

export function CreateAutomationForm({ organizationId, onDone }: { organizationId: string; onDone: () => void }) {
  const { data: triggers } = useAutomationTriggers(organizationId);
  const create = useCreateAutomation(organizationId);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<CreateAutomationFormValues>({
    resolver: zodResolver(createAutomationSchema),
    defaultValues: { actionType: 'NOTIFY_ADMINS', trigger: '', conditionField: '' },
  });

  const [triggerKey, actionType, conditionField] = useWatch({ control, name: ['trigger', 'actionType', 'conditionField'] });
  const trigger = triggers?.find((item) => item.key === triggerKey);
  const conditionFields = trigger?.variables.filter((name) => !CONTACT_VARIABLES.includes(name)) ?? [];
  const isEmail = actionType === 'SEND_EMAIL_TO_CONTACT';
  const hasHeading = actionType === 'NOTIFY_ADMINS' || isEmail;
  const contentLabel = { NOTIFY_ADMINS: 'Notification message', SEND_EMAIL_TO_CONTACT: 'Email body', SEND_SMS_TO_CONTACT: 'Text message', SEND_WHATSAPP_TO_CONTACT: 'WhatsApp message' }[actionType];

  function submit(values: CreateAutomationFormValues) {
    create.mutate(
      {
        name: values.name,
        trigger: values.trigger,
        conditions: values.conditionField ? [{ field: values.conditionField, equals: values.conditionValue ?? '' }] : undefined,
        actionType: values.actionType,
        actionConfig:
          actionType === 'NOTIFY_ADMINS'
            ? { title: values.heading ?? '', message: values.content }
            : isEmail
              ? { subject: values.heading ?? '', body: values.content }
              : { body: values.content },
      },
      { onSuccess: onDone },
    );
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
      <Field label="Rule name" htmlFor="name" error={errors.name?.message}>
        <Input id="name" autoFocus placeholder="e.g. Alert me on new enquiries" {...register('name')} />
      </Field>

      <Field label="When this happens" htmlFor="trigger" error={errors.trigger?.message} hint={trigger?.description}>
        <Select
          value={triggerKey || 'unset'}
          onValueChange={(value) => {
            setValue('trigger', value, { shouldValidate: true });
            setValue('conditionField', '');
            setValue('conditionValue', '');
            if (!triggers?.find((item) => item.key === value)?.canEmailContact) setValue('actionType', 'NOTIFY_ADMINS');
          }}
        >
          <SelectTrigger id="trigger">{trigger?.label ?? 'Choose a trigger'}</SelectTrigger>
          <SelectContent>
            {triggers?.map((item) => (
              <SelectItem key={item.key} value={item.key}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      {conditionFields.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <Field label="Only if (optional)" htmlFor="conditionField">
            <Select value={conditionField || 'none'} onValueChange={(value) => setValue('conditionField', value === 'none' ? '' : value)}>
              <SelectTrigger id="conditionField">{conditionField || 'Always'}</SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Always</SelectItem>
                {conditionFields.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          {conditionField && (
            <Field label="Equals" htmlFor="conditionValue" error={errors.conditionValue?.message}>
              <Input id="conditionValue" placeholder="e.g. CONVERTED" {...register('conditionValue')} />
            </Field>
          )}
        </div>
      )}

      <Field label="Do this" htmlFor="actionType">
        <Select value={actionType} onValueChange={(value) => setValue('actionType', value as AutomationActionType)}>
          <SelectTrigger id="actionType">{ACTION_LABELS[actionType]}</SelectTrigger>
          <SelectContent>
            <SelectItem value="NOTIFY_ADMINS">{ACTION_LABELS.NOTIFY_ADMINS}</SelectItem>
            {trigger?.canEmailContact &&
              (['SEND_EMAIL_TO_CONTACT', 'SEND_SMS_TO_CONTACT', 'SEND_WHATSAPP_TO_CONTACT'] as const).map((type) => (
                <SelectItem key={type} value={type}>
                  {ACTION_LABELS[type]}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </Field>

      {hasHeading && (
        <Field
          label={isEmail ? 'Email subject' : 'Notification title'}
          htmlFor="heading"
          error={errors.heading?.message}
          hint={trigger?.variables.length ? `Insert details with ${trigger.variables.map((name) => `{{${name}}}`).join(', ')}` : undefined}
        >
          <Input id="heading" {...register('heading')} />
        </Field>
      )}

      <Field
        label={contentLabel}
        htmlFor="content"
        error={errors.content?.message}
        hint={!hasHeading && trigger?.variables.length ? `Insert details with ${trigger.variables.map((name) => `{{${name}}}`).join(', ')}` : undefined}
      >
        <textarea id="content" rows={3} className={textareaClass} {...register('content')} />
      </Field>

      <Button type="submit" loading={create.isPending}>
        Create automation
      </Button>
    </form>
  );
}
