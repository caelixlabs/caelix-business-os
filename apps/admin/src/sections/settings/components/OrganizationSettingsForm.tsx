'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Organization } from '@/features/organizations/types';
import { updateOrganizationSchema, type UpdateOrganizationFormValues } from '@/features/organizations/schemas/organization.schema';
import { useUpdateOrganization } from '@/features/organizations/api/use-organizations';
import { PermissionGate } from '@/core/access/components/permission-gate';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Field, Input } from '@/components/ui/input';

export function OrganizationSettingsForm({ organization }: { organization: Organization }) {
  const updateOrganization = useUpdateOrganization(organization.id);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<UpdateOrganizationFormValues>({ resolver: zodResolver(updateOrganizationSchema), defaultValues: { name: organization.name, description: organization.description ?? '' } });

  useEffect(() => reset({ name: organization.name, description: organization.description ?? '' }), [organization, reset]);

  return (
    <Card className="max-w-xl p-6">
      <PermissionGate permission="organization:update" fallback={<p className="text-sm text-text-secondary">You have read-only access to organization settings.</p>}>
        <form onSubmit={handleSubmit((values) => updateOrganization.mutate(values))} className="flex flex-col gap-4">
          <Field label="Organization name" htmlFor="name" error={errors.name?.message}><Input id="name" {...register('name')} /></Field>
          <Field label="Slug" htmlFor="orgSlug" hint="Slugs can't be changed after creation"><Input id="orgSlug" value={organization.slug} disabled /></Field>
          <Field label="Description" htmlFor="description" error={errors.description?.message}><Input id="description" {...register('description')} /></Field>
          <div><Button type="submit" loading={updateOrganization.isPending}>Save changes</Button></div>
        </form>
      </PermissionGate>
    </Card>
  );
}
