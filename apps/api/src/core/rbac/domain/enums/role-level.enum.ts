/**
 * Fixed role hierarchy, highest privilege first. Every organization
 * gets these five system roles seeded automatically (see
 * packages/database/prisma/seed.ts) — organizations cannot delete or
 * rename them, though Phase 2+ may allow custom roles alongside them.
 */
export enum RoleLevel {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE',
  VIEWER = 'VIEWER',
}

export const ROLE_LEVEL_RANK: Record<RoleLevel, number> = {
  [RoleLevel.OWNER]: 0,
  [RoleLevel.ADMIN]: 1,
  [RoleLevel.MANAGER]: 2,
  [RoleLevel.EMPLOYEE]: 3,
  [RoleLevel.VIEWER]: 4,
};

/** Lower rank number = higher privilege. */
export function outranks(a: RoleLevel, b: RoleLevel): boolean {
  return ROLE_LEVEL_RANK[a] < ROLE_LEVEL_RANK[b];
}

export const DEFAULT_FIRST_USER_ROLE = RoleLevel.OWNER;
export const DEFAULT_INVITED_USER_ROLE = RoleLevel.EMPLOYEE;
