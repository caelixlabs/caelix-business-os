'use client';

import { useDashboardWidgets, useUpdateDashboardWidgets } from '@/features/dashboard-widgets/api/use-dashboard-widgets';
import { DASHBOARD_WIDGET_OPTIONS_BY_INDUSTRY } from '@/features/dashboard-widgets/types';
import { Switch } from '@/components/ui/switch';
import { Spinner } from '@/components/ui/spinner';

export function DashboardWidgetsForm({ organizationId, industry }: { organizationId: string; industry: string }) {
  const { data: widgets, isLoading } = useDashboardWidgets(organizationId);
  const updateWidgets = useUpdateDashboardWidgets(organizationId);

  if (isLoading || !widgets) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  function toggle(key: string, value: boolean) {
    updateWidgets.mutate({ ...widgets, [key]: value });
  }

  const options = DASHBOARD_WIDGET_OPTIONS_BY_INDUSTRY[industry] ?? [];
  const groups = ['Key metrics', 'Panels'] as const;

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <p className="mb-4 text-xs text-text-secondary">
        Choose what your team sees on the Overview dashboard. Changes apply for everyone in this organization.
      </p>

      {groups.map((group) => (
        <div key={group} className="mb-5 last:mb-0">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-text-secondary/70">
            {group}
          </p>
          <div className="divide-y divide-border/70">
            {options.filter((option) => option.group === group).map((option) => (
              <div key={option.key} className="flex items-center justify-between py-2.5">
                <span className="text-sm text-text">{option.label}</span>
                <Switch
                  checked={widgets[option.key] ?? true}
                  onCheckedChange={(value) => toggle(option.key, value)}
                  label={option.label}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
