'use client';

import { useOrganizationContext } from '@/contexts/organization/OrganizationContext';
import { MusicOrgDashboard } from '../dashboard/MusicOrgDashboard';

export function MusicWorkspaceView() {
  const { organization } = useOrganizationContext();

  if (organization?.industry !== 'MUSIC_ORG') return null;

  return <MusicOrgDashboard />;
}
