import { ProductType } from '../../domain/enums';

export interface CreateProductDto {
  organizationId: string;
  name: string;
  code: string;
  description?: string;
  type: ProductType;
  price: number;
  currency?: string;
  taxRate?: number;
}