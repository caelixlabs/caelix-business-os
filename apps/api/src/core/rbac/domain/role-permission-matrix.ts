import { PermissionCode } from "./enums/permission-code.enum";

export const ROLE_PERMISSION_MATRIX: Record<string, PermissionCode[]> = {
  OWNER: [
    PermissionCode.ORGANIZATION_READ,
    PermissionCode.ORGANIZATION_UPDATE,
    PermissionCode.ORGANIZATION_DELETE,

    PermissionCode.BRANCH_CREATE,
    PermissionCode.BRANCH_READ,
    PermissionCode.BRANCH_UPDATE,
    PermissionCode.BRANCH_ARCHIVE,
    PermissionCode.BRANCH_DELETE,

    PermissionCode.USER_READ,
    PermissionCode.USER_INVITE,
    PermissionCode.USER_UPDATE,
    PermissionCode.USER_SUSPEND,
    PermissionCode.USER_ROLE_ASSIGN,
  ],

  ADMIN: [
    PermissionCode.ORGANIZATION_READ,
    PermissionCode.ORGANIZATION_UPDATE,

    PermissionCode.BRANCH_CREATE,
    PermissionCode.BRANCH_READ,
    PermissionCode.BRANCH_UPDATE,
    PermissionCode.BRANCH_ARCHIVE,
    PermissionCode.BRANCH_DELETE,

    PermissionCode.USER_READ,
    PermissionCode.USER_INVITE,
    PermissionCode.USER_UPDATE,
    PermissionCode.USER_SUSPEND,
    PermissionCode.USER_ROLE_ASSIGN,
  ],

  MANAGER: [
    PermissionCode.ORGANIZATION_READ,

    PermissionCode.BRANCH_READ,
    PermissionCode.BRANCH_UPDATE,

    PermissionCode.USER_READ,
  ],

  EMPLOYEE: [
    PermissionCode.ORGANIZATION_READ,

    PermissionCode.BRANCH_READ,

    PermissionCode.USER_READ,
  ],

  VIEWER: [PermissionCode.ORGANIZATION_READ, PermissionCode.BRANCH_READ],
};
