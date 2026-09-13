export type ProductType = 'PRODUCT' | 'SERVICE';
export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export interface Product {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  description?: string;
  type: ProductType;
  status: ProductStatus;
  price: number;
  currency: string;
  taxRate?: number;
}
