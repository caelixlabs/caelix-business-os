'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';

import { useSettings, useUpdateSettings } from '../api/use-settings';
import type { OrganizationSettings } from '../types';

import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';

export function PreferencesForm({ organizationId }: { organizationId: string }) {
  const { data: settings } = useSettings(organizationId);
  const updateSettings = useUpdateSettings(organizationId);

  const { register, control, handleSubmit, reset } = useForm<OrganizationSettings>();

  useEffect(() => {
    if (settings) reset(settings);
  }, [settings, reset]);

  if (!settings) {
    return (
      <Card className="flex max-w-lg justify-center p-6">
        <Spinner />
      </Card>
    );
  }

  return (
    <Card className="max-w-lg p-6">
      <form
        onSubmit={handleSubmit((values) => updateSettings.mutate(values))}
        className="flex flex-col gap-4"
      >
        <div className="grid grid-cols-2 gap-3">
          <Field label="Timezone" htmlFor="timezone">
            <Input id="timezone" placeholder="UTC" {...register('timezone')} />
          </Field>
          <Field label="Currency" htmlFor="currency">
            <Input id="currency" placeholder="USD" {...register('currency')} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Date format" htmlFor="dateFormat">
            <Input id="dateFormat" placeholder="YYYY-MM-DD" {...register('dateFormat')} />
          </Field>

          <Field label="Week starts on" htmlFor="weekStart">
            <Controller
              control={control}
              name="weekStart"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>{field.value === 'sunday' ? 'Sunday' : 'Monday'}</SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monday">Monday</SelectItem>
                    <SelectItem value="sunday">Sunday</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        </div>

        <div>
          <Button type="submit" loading={updateSettings.isPending}>
            Save preferences
          </Button>
        </div>
      </form>
    </Card>
  );
}
