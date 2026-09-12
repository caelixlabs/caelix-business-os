'use client';

import {
  Controller,
  useForm,
} from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import {
  createOrganizationSchema,
  type CreateOrganizationFormValues,
} from '@/features/auth/schemas/auth.schema';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Field,
  Input,
} from '@/components/ui/input';

import { IndustrySelector } from './industry-selector';
import { slugify } from '../utils/slugify';

interface CreateOrganizationFormProps {
  loading: boolean;
  onSubmit: (
    values: CreateOrganizationFormValues,
  ) => void;
}

export function CreateOrganizationForm({
  loading,
  onSubmit,
}: CreateOrganizationFormProps) {
  const form = useForm<CreateOrganizationFormValues>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: '',
      slug: '',
      industry: undefined,
    },
  });

  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <Card className="p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <Field
          label="Organization name"
          htmlFor="name"
          error={errors.name?.message}
        >
          <Input
            id="name"
            placeholder="Acme Music Academy"
            autoFocus
            {...register('name', {
              onChange: (event) => {
                const value = event.target.value;

                if (!form.getValues('slug')) {
                  setValue(
                    'slug',
                    slugify(value),
                    {
                      shouldDirty: true,
                    },
                  );
                }
              },
            })}
          />
        </Field>

        <Field
          label="Organization slug"
          htmlFor="slug"
          hint="Lowercase letters, numbers, and hyphens only"
          error={errors.slug?.message}
        >
          <Input
            id="slug"
            {...register('slug', {
              onChange: (event) => {
                setValue(
                  'slug',
                  slugify(
                    event.target.value,
                  ),
                  {
                    shouldDirty: true,
                  },
                );
              },
            })}
          />
        </Field>

        <Field
          label="Industry"
          htmlFor="industry"
          error={errors.industry?.message}
        >
          <Controller
            name="industry"
            control={control}
            render={({ field }) => (
              <IndustrySelector
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </Field>

        <Button
          type="submit"
          loading={loading}
          className="mt-1 w-full"
        >
          Continue
        </Button>
      </form>
    </Card>
  );
}