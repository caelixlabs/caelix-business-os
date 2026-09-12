'use client';

import { useState } from 'react';
import { useOrganizationContext } from '@/contexts/organization/OrganizationContext';
import { useAuditLog, type AuditLogFilters } from '@/features/audit/api/use-audit-log';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { AuditLogFilters as Filters } from './components/AuditLogFilters';
import { AuditLogList } from './components/AuditLogList';

export default function AuditLogSection() {
  const { organization } = useOrganizationContext();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<AuditLogFilters>({});
  const { data: result, isLoading } = useAuditLog(organization?.id, page, filters);

  function updateFilter(key: keyof AuditLogFilters, value: string) {
    setPage(1);
    setFilters((current) => ({ ...current, [key]: value || undefined }));
  }

  return (
    <div>
      <PageHeader title="Audit log" description="A record of what happened, and when." />
      <Filters filters={filters} onChange={updateFilter} />
      {isLoading || !result ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : result.items.length === 0 ? (
        <EmptyState title="Nothing recorded yet" />
      ) : (
        <>
          <AuditLogList items={result.items} />
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-text-secondary">Page {result.meta.page} of {result.meta.totalPages} · {result.meta.total} total entries</p>
            <div className="flex gap-2">
              <Button variant="secondary" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>Previous</Button>
              <Button variant="secondary" disabled={page >= result.meta.totalPages} onClick={() => setPage((current) => current + 1)}>Next</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
