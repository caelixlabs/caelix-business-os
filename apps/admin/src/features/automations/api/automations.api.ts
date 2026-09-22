import { apiDelete, apiGet, apiPatch, apiPost } from '@/api/client';
import type { AutomationActionType, AutomationRule, AutomationTrigger } from '../types';

export interface CreateAutomationInput {
  name: string;
  trigger: string;
  conditions?: { field: string; equals: string }[];
  actionType: AutomationActionType;
  actionConfig: Record<string, string>;
}

export const automationsApi = {
  triggers: (organizationId: string) =>
    apiGet<AutomationTrigger[]>(`/organizations/${organizationId}/automations/triggers`),
  list: (organizationId: string) => apiGet<AutomationRule[]>(`/organizations/${organizationId}/automations`),
  create: (organizationId: string, input: CreateAutomationInput) =>
    apiPost<AutomationRule>(`/organizations/${organizationId}/automations`, input),
  update: (organizationId: string, id: string, input: { enabled?: boolean; name?: string }) =>
    apiPatch<AutomationRule>(`/organizations/${organizationId}/automations/${id}`, input),
  remove: (organizationId: string, id: string) =>
    apiDelete<void>(`/organizations/${organizationId}/automations/${id}`),
};
