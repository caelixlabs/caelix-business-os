import { PermissionCode, RoleLevel } from "@/core/rbac/domain/enums";

export enum MusicOrgRole {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  RECEPTIONIST = "RECEPTIONIST",
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
}

export interface MusicOrgRoleDefinition {
  role: MusicOrgRole;

  coreRole: RoleLevel;

  permissions: PermissionCode[];
}

export const MUSIC_ORG_ROLE_DEFINITIONS: Record<
  MusicOrgRole,
  MusicOrgRoleDefinition
> = {
  [MusicOrgRole.OWNER]: {
    role: MusicOrgRole.OWNER,

    coreRole: RoleLevel.OWNER,

    permissions: [
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
  },

  [MusicOrgRole.ADMIN]: {
    role: MusicOrgRole.ADMIN,

    coreRole: RoleLevel.ADMIN,

    permissions: [
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
  },

  [MusicOrgRole.RECEPTIONIST]: {
    role: MusicOrgRole.RECEPTIONIST,

    coreRole: RoleLevel.EMPLOYEE,

    permissions: [
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
  },

  [MusicOrgRole.TEACHER]: {
    role: MusicOrgRole.TEACHER,

    coreRole: RoleLevel.EMPLOYEE,

    permissions: [
      PermissionCode.MUSIC_STUDENT_READ,

      PermissionCode.MUSIC_COURSE_READ,

      PermissionCode.MUSIC_BATCH_READ,

      PermissionCode.MUSIC_ENROLLMENT_READ,

      PermissionCode.MUSIC_ATTENDANCE_READ,
      PermissionCode.MUSIC_ATTENDANCE_MANAGE,

      PermissionCode.MUSIC_PRACTICE_READ,
      PermissionCode.MUSIC_PRACTICE_MANAGE,
    ],
  },

  [MusicOrgRole.STUDENT]: {
    role: MusicOrgRole.STUDENT,

    coreRole: RoleLevel.VIEWER,

    permissions: [
      PermissionCode.MUSIC_COURSE_READ,
      PermissionCode.MUSIC_BATCH_READ,
      PermissionCode.MUSIC_PRACTICE_READ,
    ],
  },
};
