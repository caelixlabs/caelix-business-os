import { SetMetadata } from '@nestjs/common';
import { PermissionCode } from '../../domain/enums';

export const PERMISSIONS_KEY = 'requiredPermissions';

/**
 * Marks a route as requiring one or more permissions. Enforced by
 * PermissionsGuard, which reads the caller's granted permissions off
 * the JWT payload (embedded at login — see AuthenticationModule) and
 * checks every permission listed here is present. Requires ALL listed
 * permissions, not just one.
 */
export const RequirePermissions = (...permissions: PermissionCode[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
