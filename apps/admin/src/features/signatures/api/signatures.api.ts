import { apiGet, apiPost } from '@/api/client';
import type { PublicSignatureView, SignatureRequest } from '../types';

const base = (organizationId: string) => `/organizations/${organizationId}/signatures`;

export interface RequestSignatureInput {
  title: string;
  body: string;
  signerName: string;
  signerEmail: string;
  contactId?: string;
  expiresInDays?: number;
}

export const signaturesApi = {
  list: (organizationId: string) => apiGet<SignatureRequest[]>(base(organizationId)),
  create: (organizationId: string, input: RequestSignatureInput) =>
    apiPost<SignatureRequest & { signingUrl: string }>(base(organizationId), input),
  link: (organizationId: string, id: string) => apiGet<{ signingUrl: string }>(`${base(organizationId)}/${id}/link`),
  cancel: (organizationId: string, id: string) => apiPost<void>(`${base(organizationId)}/${id}/cancel`),
};

export const publicSignaturesApi = {
  view: (token: string) => apiGet<PublicSignatureView>(`/public/signatures/${token}`),
  sign: (token: string, input: { typedName: string; agreed: boolean }) =>
    apiPost<PublicSignatureView>(`/public/signatures/${token}/sign`, input),
  decline: (token: string, reason?: string) => apiPost<PublicSignatureView>(`/public/signatures/${token}/decline`, { reason }),
};
