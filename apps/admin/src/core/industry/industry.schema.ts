import { z } from 'zod';
import { INDUSTRY_REGISTRY, type IndustryType } from './industry.registry';

const INDUSTRY_KEYS = Object.keys(INDUSTRY_REGISTRY) as [
  IndustryType,
  ...IndustryType[],
];

export const industryTypeSchema = z.enum(INDUSTRY_KEYS);
