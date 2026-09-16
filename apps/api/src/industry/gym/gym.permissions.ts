import { PermissionCode } from '@/core/rbac/domain/enums/permission-code.enum';
import { RoleLevel } from '@/core/rbac/domain/enums/role-level.enum';

/**
 * Gym's contribution to each organization-wide system role, merged into
 * ROLE_PERMISSION_MATRIX by SeedOrganizationRolesHandler when the
 * organization's industry is GYM. OWNER/ADMIN get full access; MANAGER
 * covers front-desk duties (members + memberships + attendance);
 * EMPLOYEE covers trainer duties (classes + attendance); VIEWER is
 * read-only, for a member-facing login.
 */
export const GYM_PERMISSIONS_BY_LEVEL: Record<RoleLevel, PermissionCode[]> = {
  [RoleLevel.OWNER]: [
    PermissionCode.GYM_MEMBER_READ,
    PermissionCode.GYM_MEMBER_CREATE,
    PermissionCode.GYM_MEMBER_UPDATE,
    PermissionCode.GYM_CLASS_READ,
    PermissionCode.GYM_CLASS_MANAGE,
    PermissionCode.GYM_TRAINER_READ,
    PermissionCode.GYM_TRAINER_MANAGE,
    PermissionCode.GYM_MEMBERSHIP_READ,
    PermissionCode.GYM_MEMBERSHIP_MANAGE,
    PermissionCode.GYM_ATTENDANCE_READ,
    PermissionCode.GYM_ATTENDANCE_MANAGE,
  ],

  [RoleLevel.ADMIN]: [
    PermissionCode.GYM_MEMBER_READ,
    PermissionCode.GYM_MEMBER_CREATE,
    PermissionCode.GYM_MEMBER_UPDATE,
    PermissionCode.GYM_CLASS_READ,
    PermissionCode.GYM_CLASS_MANAGE,
    PermissionCode.GYM_TRAINER_READ,
    PermissionCode.GYM_TRAINER_MANAGE,
    PermissionCode.GYM_MEMBERSHIP_READ,
    PermissionCode.GYM_MEMBERSHIP_MANAGE,
    PermissionCode.GYM_ATTENDANCE_READ,
    PermissionCode.GYM_ATTENDANCE_MANAGE,
  ],

  [RoleLevel.MANAGER]: [
    PermissionCode.GYM_MEMBER_READ,
    PermissionCode.GYM_MEMBER_CREATE,
    PermissionCode.GYM_MEMBER_UPDATE,
    PermissionCode.GYM_CLASS_READ,
    PermissionCode.GYM_TRAINER_READ,
    PermissionCode.GYM_MEMBERSHIP_READ,
    PermissionCode.GYM_MEMBERSHIP_MANAGE,
    PermissionCode.GYM_ATTENDANCE_READ,
    PermissionCode.GYM_ATTENDANCE_MANAGE,
  ],

  [RoleLevel.EMPLOYEE]: [
    PermissionCode.GYM_MEMBER_READ,
    PermissionCode.GYM_CLASS_READ,
    PermissionCode.GYM_CLASS_MANAGE,
    PermissionCode.GYM_TRAINER_READ,
    PermissionCode.GYM_ATTENDANCE_READ,
    PermissionCode.GYM_ATTENDANCE_MANAGE,
  ],

  [RoleLevel.VIEWER]: [
    PermissionCode.GYM_CLASS_READ,
    PermissionCode.GYM_TRAINER_READ,
  ],
};
