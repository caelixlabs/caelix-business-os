import type { IndustryType } from '@/core/industry/industry.types';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  industry: IndustryType;
  createdAt: string;
  updatedAt: string;
}
