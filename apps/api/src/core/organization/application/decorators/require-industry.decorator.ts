import { SetMetadata } from '@nestjs/common';
import { IndustryType } from '../../domain/enums/industry-type.enum';

export const INDUSTRY_KEY = 'requiredIndustries';

/**
 * Marks a route as belonging to one or more specific industries.
 * Enforced by IndustryGuard, which loads the caller's organization
 * industry and 404s (never 403) when it doesn't match — an org outside
 * the required industry should never learn the route exists at all.
 */
export const RequireIndustry = (...industries: IndustryType[]) =>
  SetMetadata(INDUSTRY_KEY, industries);
