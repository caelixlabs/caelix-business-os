'use client';

import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import type { AuditLogFilters } from '@/features/audit/api/use-audit-log';

const ACTIONS = [
  { value: '', label: 'All actions' },
  { value: 'organization.created', label: 'Organization created' },
  { value: 'branch.created', label: 'Branch created' },
  { value: 'user.registered', label: 'User registered' },
];

const ENTITY_TYPES = [
  { value: '', label: 'All entities' },
  { value: 'Organization', label: 'Organization' },
  { value: 'Branch', label: 'Branch' },
  { value: 'User', label: 'User' },
];

export function AuditLogFilters({ filters, onChange }: { filters: AuditLogFilters; onChange: (key: keyof AuditLogFilters, value: string) => void }) {
  return (
    <Card className="mb-4 p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Select value={filters.action ?? ''} onValueChange={(value) => onChange('action', value)}>
          <SelectTrigger>{ACTIONS.find((item) => item.value === (filters.action ?? ''))?.label}</SelectTrigger>
          <SelectContent>{ACTIONS.map((item) => <SelectItem key={item.value} value={item.value || 'ALL'}>{item.label}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={filters.entityType ?? ''} onValueChange={(value) => onChange('entityType', value)}>
          <SelectTrigger>{ENTITY_TYPES.find((item) => item.value === (filters.entityType ?? ''))?.label}</SelectTrigger>
          <SelectContent>{ENTITY_TYPES.map((item) => <SelectItem key={item.value} value={item.value || 'ALL'}>{item.label}</SelectItem>)}</SelectContent>
        </Select>
      </div>
    </Card>
  );
}
