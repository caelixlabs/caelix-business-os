import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Marks a route as not requiring authentication. JwtAuthGuard checks
 * for this metadata before enforcing the JWT check — everything is
 * protected by default; this is the explicit opt-out.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
