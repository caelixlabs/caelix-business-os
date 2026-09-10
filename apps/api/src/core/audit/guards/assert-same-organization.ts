import { ForbiddenException } from '@nestjs/common';

/**
 * Every route nested under /organizations/:organizationId/* must call
 * this before doing anything else. Without it, any authenticated user
 * — regardless of which organization they belong to — could pass a
 * different organizationId in the URL and act on data that isn't
 * theirs, since PermissionsGuard only checks *what* the caller can do,
 * never *whose* data they're doing it to.
 */
export function assertSameOrganization(callerOrganizationId: string, routeOrganizationId: string): void {
  if (callerOrganizationId !== routeOrganizationId) {
    throw new ForbiddenException("You do not have access to this organization's resources");
  }
}
