'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useCreateOrganization } from '@/features/organizations/api/use-organizations';
import { useRegister } from '@/features/auth/api/use-auth';
import {
  createOrganizationSchema,
  registerOwnerSchema,
  type CreateOrganizationFormValues,
  type RegisterOwnerFormValues,
} from '@/features/auth/schemas/auth.schema';

import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { INDUSTRIES } from '@/features/organizations/constants/industries';
import { filterIndustries, slugify } from '@/features/organizations/utils/industry.utils';

export default function SignupPage() {
  const router = useRouter();
  const createOrganization = useCreateOrganization();
  const registerOwner = useRegister();

  const [step, setStep] = useState<1 | 2>(1);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [industryInput, setIndustryInput] = useState('');
  const [industryOpen, setIndustryOpen] = useState(false);

  const orgForm = useForm<CreateOrganizationFormValues>({
    resolver: zodResolver(createOrganizationSchema),
  });
  const ownerForm = useForm<RegisterOwnerFormValues>({
    resolver: zodResolver(registerOwnerSchema),
  });

  const filteredIndustries = filterIndustries(industryInput);

  function handleSelectIndustry(industry: (typeof INDUSTRIES)[number]) {
    setIndustryInput(industry.label);
    setIndustryOpen(false);

    orgForm.setValue('industry', industry.value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }

  function handleCreateOrganization(values: CreateOrganizationFormValues) {
    const selectedIndustry = INDUSTRIES.find(
      (industry) => industry.label === industryInput,
    );

    if (!selectedIndustry) {
      orgForm.setError('industry', {
        type: 'manual',
        message: 'Please select an industry from the suggestions',
      });
      setIndustryOpen(true);
      return;
    }

    const organizationValues: CreateOrganizationFormValues = {
      ...values,
      industry: selectedIndustry.value,
    };

    createOrganization.mutate(organizationValues, {
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
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Image
            src="/brand/caelix-business-os-lockup.png"
            alt="Caelix Business OS"
            width={110}
            height={110}
            priority
          />
          <h1 className="text-lg font-semibold text-text">
            {step === 1 ? 'Create your organization' : 'Create your owner account'}
          </h1>
          <p className="text-xs text-text-secondary">Step {step} of 2</p>
        </div>

        <Card className="p-6">
          {step === 1 ? (
            <form
              onSubmit={orgForm.handleSubmit(handleCreateOrganization)}
              className="flex flex-col gap-4"
            >
              <Field
                label="Organization name"
                htmlFor="name"
                error={orgForm.formState.errors.name?.message}
              >
                <Input
                  id="name"
                  placeholder="Acme Gym"
                  autoFocus
                  {...orgForm.register('name', {
                    onChange: (e) => {
                      if (!slugTouched) orgForm.setValue('slug', slugify(e.target.value));
                    },
                  })}
                />
              </Field>

              <Field
                label="Organization slug"
                htmlFor="slug"
                hint="Used to sign in later — lowercase letters, numbers, and hyphens only"
                error={orgForm.formState.errors.slug?.message}
              >
                <Input
                  id="slug"
                  {...orgForm.register('slug', {
                    onChange: (e) => {
                      setSlugTouched(true);
                      orgForm.setValue('slug', slugify(e.target.value));
                    },
                  })}
                />
              </Field>

              <Field
                label="Industry"
                htmlFor="industry"
                error={orgForm.formState.errors.industry?.message}
              >
                <div className="relative">
                  <Input
                    id="industry"
                    value={industryInput}
                    placeholder="Type your industry..."
                    autoComplete="off"
                    onFocus={() => setIndustryOpen(true)}
                    onChange={(e) => {
                      setIndustryInput(e.target.value);
                      setIndustryOpen(true);
                    }}
                    onBlur={() => {
                      setTimeout(() => setIndustryOpen(false), 150);
                    }}
                  />

                  {industryOpen && filteredIndustries.length > 0 && (
                    <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-border bg-surface shadow-lg">
                      {filteredIndustries.map((industry) => (
                        <button
                          key={industry.value}
                          type="button"
                          className="flex w-full cursor-pointer px-3 py-2.5 text-left text-sm text-text hover:bg-surface-secondary"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleSelectIndustry(industry)}
                        >
                          {industry.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </Field>

              <Button type="submit" loading={createOrganization.isPending} className="mt-1 w-full">
                Continue
              </Button>
            </form>
          ) : (
            <form
              onSubmit={ownerForm.handleSubmit(handleRegisterOwner)}
              className="flex flex-col gap-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="First name"
                  htmlFor="firstName"
                  error={ownerForm.formState.errors.firstName?.message}
                >
                  <Input id="firstName" autoFocus {...ownerForm.register('firstName')} />
                </Field>
                <Field
                  label="Last name"
                  htmlFor="lastName"
                  error={ownerForm.formState.errors.lastName?.message}
                >
                  <Input id="lastName" {...ownerForm.register('lastName')} />
                </Field>
              </div>

              <Field label="Email" htmlFor="email" error={ownerForm.formState.errors.email?.message}>
                <Input id="email" type="email" {...ownerForm.register('email')} />
              </Field>

              <Field
                label="Password"
                htmlFor="password"
                hint="At least 8 characters"
                error={ownerForm.formState.errors.password?.message}
              >
                <Input id="password" type="password" {...ownerForm.register('password')} />
              </Field>

              <Button type="submit" loading={registerOwner.isPending} className="mt-1 w-full">
                Create account
              </Button>
            </form>
          )}
        </Card>

        <p className="mt-4 text-center text-sm text-text-secondary">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-accent hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
