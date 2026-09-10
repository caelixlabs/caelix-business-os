import { RoleLevel } from '../enums';

export interface EffectiveAccess {
  roles: string[];
  permissions: string[];
}

export interface RoleSummary {
  id: string;
  name: string;
  level: RoleLevel;
}

/**
 * RBAC is intentionally read/assignment-oriented rather than a rich
 * DDD aggregate: Role and Permission are close to reference data,
 * seeded once (see prisma/seed.ts) and rarely mutated by end users in
 * this phase. The one behaviour that matters — "what can this user
 * do" — is exposed via getEffectiveAccess, which Authentication calls
 * once at login time to embed into the JWT, so every subsequent
 * request can authorize from the token alone without a DB round trip.
 */
export interface RbacRepository {
  /** Assigns a system role (by level) to a user within an organization. */
  assignSystemRole(params: {
    userId: string;
    organizationId: string;
    level: RoleLevel;
    branchId?: string;
  }): Promise<void>;

  getEffectiveAccess(userId: string): Promise<EffectiveAccess>;

  /** Whether this organization already has anyone holding the OWNER role. */
  hasOwner(organizationId: string): Promise<boolean>;

  listRolesForOrganization(organizationId: string): Promise<RoleSummary[]>;

  /** A user's single primary role, or null if none has been assigned yet. */
  getUserRole(userId: string): Promise<RoleSummary | null>;

  /**
   * Replaces whatever role(s) a user currently holds within an
   * organization with exactly one new role — this phase models "one
   * role per user", not stacked grants.
   */
  setUserRole(params: { userId: string; organizationId: string; roleId: string }): Promise<void>;
}