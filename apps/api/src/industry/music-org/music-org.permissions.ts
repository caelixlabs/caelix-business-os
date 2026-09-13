import { PermissionCode } from '@/core/rbac/domain/enums/permission-code.enum';
import { RoleLevel } from '@/core/rbac/domain/enums/role-level.enum';

/**
 * Music Org's contribution to each organization-wide system role, merged
 * into ROLE_PERMISSION_MATRIX by SeedOrganizationRolesHandler when the
 * organization's industry is MUSIC_ORG. OWNER/ADMIN get full access;
 * MANAGER covers front-desk duties (enrollment + attendance); EMPLOYEE
 * covers teaching duties (attendance + practice logs); VIEWER is
 * read-only, for a student/guardian-facing login.
 */
export const MUSIC_ORG_PERMISSIONS_BY_LEVEL: Record<RoleLevel, PermissionCode[]> = {
  [RoleLevel.OWNER]: [
    PermissionCode.MUSIC_STUDENT_READ,
    PermissionCode.MUSIC_STUDENT_CREATE,
    PermissionCode.MUSIC_STUDENT_UPDATE,
    PermissionCode.MUSIC_COURSE_READ,
    PermissionCode.MUSIC_COURSE_MANAGE,
    PermissionCode.MUSIC_BATCH_READ,
    PermissionCode.MUSIC_BATCH_MANAGE,
    PermissionCode.MUSIC_ENROLLMENT_READ,
    PermissionCode.MUSIC_ENROLLMENT_MANAGE,
    PermissionCode.MUSIC_ATTENDANCE_READ,
    PermissionCode.MUSIC_ATTENDANCE_MANAGE,
    PermissionCode.MUSIC_PRACTICE_READ,
    PermissionCode.MUSIC_PRACTICE_MANAGE,
  ],

  [RoleLevel.ADMIN]: [
    PermissionCode.MUSIC_STUDENT_READ,
    PermissionCode.MUSIC_STUDENT_CREATE,
    PermissionCode.MUSIC_STUDENT_UPDATE,
    PermissionCode.MUSIC_COURSE_READ,
    PermissionCode.MUSIC_COURSE_MANAGE,
    PermissionCode.MUSIC_BATCH_READ,
    PermissionCode.MUSIC_BATCH_MANAGE,
    PermissionCode.MUSIC_ENROLLMENT_READ,
    PermissionCode.MUSIC_ENROLLMENT_MANAGE,
    PermissionCode.MUSIC_ATTENDANCE_READ,
    PermissionCode.MUSIC_ATTENDANCE_MANAGE,
    PermissionCode.MUSIC_PRACTICE_READ,
    PermissionCode.MUSIC_PRACTICE_MANAGE,
  ],

  [RoleLevel.MANAGER]: [
    PermissionCode.MUSIC_STUDENT_READ,
    PermissionCode.MUSIC_STUDENT_CREATE,
    PermissionCode.MUSIC_STUDENT_UPDATE,
    PermissionCode.MUSIC_COURSE_READ,
    PermissionCode.MUSIC_BATCH_READ,
    PermissionCode.MUSIC_ENROLLMENT_READ,
    PermissionCode.MUSIC_ENROLLMENT_MANAGE,
    PermissionCode.MUSIC_ATTENDANCE_READ,
    PermissionCode.MUSIC_ATTENDANCE_MANAGE,
  ],

  [RoleLevel.EMPLOYEE]: [
    PermissionCode.MUSIC_STUDENT_READ,
    PermissionCode.MUSIC_COURSE_READ,
    PermissionCode.MUSIC_BATCH_READ,
    PermissionCode.MUSIC_ENROLLMENT_READ,
    PermissionCode.MUSIC_ATTENDANCE_READ,
    PermissionCode.MUSIC_ATTENDANCE_MANAGE,
    PermissionCode.MUSIC_PRACTICE_READ,
    PermissionCode.MUSIC_PRACTICE_MANAGE,
  ],

  [RoleLevel.VIEWER]: [
    PermissionCode.MUSIC_COURSE_READ,
    PermissionCode.MUSIC_BATCH_READ,
    PermissionCode.MUSIC_PRACTICE_READ,
  ],
};
