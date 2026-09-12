'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useCreateOrganization } from '@/features/organizations/api/use-organizations';
import { useRegister } from '@/features/auth/api/use-auth';
import {
  type CreateOrganizationFormValues,
  type RegisterOwnerFormValues,
} from '@/features/auth/schemas/auth.schema';

import { SignupHeader } from '../components/signup-header';
import { CreateOrganizationForm } from '@/core/organization/components/create-organization-form';
import { RegisterOwnerForm } from '../components/register-owner-form';

export function SignupView() {
  const router = useRouter();
  const createOrganization = useCreateOrganization();
  const registerOwner = useRegister();
  const [step, setStep] = useState<1 | 2>(1);
  const [organizationId, setOrganizationId] = useState<string | null>(null);

  function handleCreateOrganization(values: CreateOrganizationFormValues) {
    createOrganization.mutate(values, {
      onSuccess: (organization) => {
        setOrganizationId(organization.id);
        setStep(2);
      },
    });
  }

  function handleRegisterOwner(values: RegisterOwnerFormValues) {
    if (!organizationId) return;

    registerOwner.mutate(
      { ...values, organizationId },
      { onSuccess: () => router.replace('/dashboard') },
    );
  }

  return (
    <div>
      <SignupHeader step={step} />

      {step === 1 ? (
        <CreateOrganizationForm
          loading={createOrganization.isPending}
          onSubmit={handleCreateOrganization}
        />
      ) : (
        <RegisterOwnerForm
          loading={registerOwner.isPending}
          onSubmit={handleRegisterOwner}
        />
      )}

      <p className="mt-4 text-center text-sm text-text-secondary">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium text-accent hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
