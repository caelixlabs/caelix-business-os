import { apiGet, apiPatch, apiPost } from '@/api/client';
import type { Product } from '../types';

export const productsApi = {
  list: (organizationId: string) =>
    apiGet<Product[]>(`/organizations/${organizationId}/products`),

  get: (organizationId: string, id: string) =>
    apiGet<Product>(`/organizations/${organizationId}/products/${id}`),

  create: (
    organizationId: string,
    input: {
      name: string;
      code: string;
      type: string;
      description?: string;
      price: number;
      currency?: string;
      taxRate?: number;
    },
  ) => apiPost<Product>(`/organizations/${organizationId}/products`, input),

  update: (
    organizationId: string,
    id: string,
    input: { name?: string; description?: string; price?: number; currency?: string; taxRate?: number },
  ) => apiPatch<Product>(`/organizations/${organizationId}/products/${id}`, input),

  archive: (organizationId: string, id: string) =>
    apiPatch<Product>(`/organizations/${organizationId}/products/${id}/archive`),

  activate: (organizationId: string, id: string) =>
    apiPatch<Product>(`/organizations/${organizationId}/products/${id}/activate`),

  deactivate: (organizationId: string, id: string) =>
    apiPatch<Product>(`/organizations/${organizationId}/products/${id}/deactivate`),
};
