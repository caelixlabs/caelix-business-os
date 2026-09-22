import { apiDelete, apiGet, apiPost } from '@/api/client';
import type { Message, MessageChannel, MessageTemplate } from '../types';

const base = (organizationId: string) => `/organizations/${organizationId}/communication`;

export const communicationApi = {
  channels: (organizationId: string) => apiGet<Record<MessageChannel, boolean>>(`${base(organizationId)}/channels`),
  messages: (organizationId: string) => apiGet<Message[]>(`${base(organizationId)}/messages`),
  send: (
    organizationId: string,
    input: { channel: MessageChannel; contactId: string; subject?: string; body: string },
  ) => apiPost<Message>(`${base(organizationId)}/messages`, input),
  templates: (organizationId: string) => apiGet<MessageTemplate[]>(`${base(organizationId)}/templates`),
  createTemplate: (
    organizationId: string,
    input: { name: string; channel: MessageChannel; subject?: string; body: string },
  ) => apiPost<MessageTemplate>(`${base(organizationId)}/templates`, input),
  removeTemplate: (organizationId: string, id: string) =>
    apiDelete<void>(`${base(organizationId)}/templates/${id}`),
};
