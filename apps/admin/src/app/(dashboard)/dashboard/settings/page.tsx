'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAuthStore } from '@/store/auth.store';
import { useDeleteOrganization, useOrganization, useUpdateOrganization } from '@/features/organizations/api/use-organizations';
import {
  updateOrganizationSchema,
  type UpdateOrganizationFormValues,
} from '@/features/organizations/schemas/organization.schema';

import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { PreferencesForm } from '@/features/settings/component/preferences-form';
import { PermissionGate } from '@/components/auth/permission-gate';

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const { data: organization } = useOrganization(user?.organizationId);
  const updateOrganization = useUpdateOrganization(user?.organizationId ?? '');
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const deleteOrganization = useDeleteOrganization(organization?.id ?? '',);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateOrganizationFormValues>({ resolver: zodResolver(updateOrganizationSchema) });

  useEffect(() => {
    if (organization) {
      reset({ name: organization.name, description: organization.description ?? '' });
    }
  }, [organization, reset]);

  return (
    <div>
      <PageHeader title="Settings" description="Organization details." />

      {!organization ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <Card className="max-w-lg p-6">
            <PermissionGate
              permission="organization:update"
              fallback={
                <p className="text-sm text-text-secondary">
                  You have read-only access to organization settings.
                </p>
              }
            >
              <form
                onSubmit={handleSubmit((values) => updateOrganization.mutate(values))}
                className="flex flex-col gap-4"
              >
                <Field label="Organization name" htmlFor="name" error={errors.name?.message}>
                  <Input id="name" {...register('name')} />
                </Field>

                <Field label="Slug" htmlFor="orgSlug" hint="Slugs can't be changed after creation">
                  <Input id="orgSlug" value={organization.slug} disabled />
                </Field>

                <Field label="Description" htmlFor="description" error={errors.description?.message}>
                  <Input id="description" {...register('description')} />
                </Field>
                <div>
                  <Button type="submit" loading={updateOrganization.isPending}>
                    Save changes
                  </Button>
                </div>
              </form>
            </PermissionGate>
          </Card>

          <div>
            <h2 className="mb-3 text-sm font-semibold text-text">Preferences</h2>
            <PermissionGate
              permission="organization:update"
              fallback={
                <p className="text-sm text-text-secondary">
                  You have read-only access to
                  organization preferences.
                </p>
              }
            >
              <PreferencesForm organizationId={organization.id} />
            </PermissionGate>
          </div>
        </div>
      )}
    </div>
  );
}