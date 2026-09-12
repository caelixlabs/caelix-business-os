'use client';

import { useOrganizationContext } from '@/contexts/organization/OrganizationContext';
import { PageHeader } from '@/components/ui/page-header';
import { Spinner } from '@/components/ui/spinner';
import { PermissionGate } from '@/core/access/components/permission-gate';
import { PreferencesForm } from '@/features/settings/components/preferences-form';
import { OrganizationSettingsForm } from './components/OrganizationSettingsForm';

export default function SettingsSection() {
  const { organization, isLoading } = useOrganizationContext();

  return (
    <div>
      <PageHeader title="Settings" description="Organization details and workspace preferences." />
      {isLoading || !organization ? <div className="flex justify-center py-16"><Spinner /></div> : (
        <div className="space-y-8">
          <OrganizationSettingsForm organization={organization} />
          <section>
            <h2 className="mb-3 text-sm font-semibold text-text">Preferences</h2>
            <PermissionGate permission="organization:update" fallback={<p className="text-sm text-text-secondary">You have read-only access to organization preferences.</p>}>
              <PreferencesForm organizationId={organization.id} />
            </PermissionGate>
          </section>
        </div>
      )}
    </div>
  );
}
