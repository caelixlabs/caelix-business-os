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

    PermissionCode.CONTACT_READ,
    PermissionCode.CONTACT_CREATE,
    PermissionCode.CONTACT_UPDATE,
    PermissionCode.CONTACT_ARCHIVE,

    PermissionCode.BOOKING_READ,
    PermissionCode.BOOKING_CREATE,
    PermissionCode.BOOKING_MANAGE,

    PermissionCode.PRODUCT_READ,
    PermissionCode.PRODUCT_CREATE,
    PermissionCode.PRODUCT_UPDATE,
    PermissionCode.PRODUCT_ARCHIVE,

    PermissionCode.INVENTORY_READ,
    PermissionCode.INVENTORY_CREATE,
    PermissionCode.INVENTORY_MANAGE,

    PermissionCode.ENQUIRY_READ,
    PermissionCode.ENQUIRY_CREATE,
    PermissionCode.ENQUIRY_MANAGE,
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

    PermissionCode.CONTACT_READ,
    PermissionCode.CONTACT_CREATE,
    PermissionCode.CONTACT_UPDATE,
    PermissionCode.CONTACT_ARCHIVE,

    PermissionCode.BOOKING_READ,
    PermissionCode.BOOKING_CREATE,
    PermissionCode.BOOKING_MANAGE,

    PermissionCode.PRODUCT_READ,
    PermissionCode.PRODUCT_CREATE,
    PermissionCode.PRODUCT_UPDATE,
    PermissionCode.PRODUCT_ARCHIVE,

    PermissionCode.INVENTORY_READ,
    PermissionCode.INVENTORY_CREATE,
    PermissionCode.INVENTORY_MANAGE,

    PermissionCode.ENQUIRY_READ,
    PermissionCode.ENQUIRY_CREATE,
    PermissionCode.ENQUIRY_MANAGE,
  ],

  MANAGER: [
    PermissionCode.ORGANIZATION_READ,

    PermissionCode.BRANCH_READ,
    PermissionCode.BRANCH_UPDATE,

    PermissionCode.USER_READ,

    PermissionCode.CONTACT_READ,
    PermissionCode.CONTACT_CREATE,
    PermissionCode.CONTACT_UPDATE,

    PermissionCode.BOOKING_READ,
    PermissionCode.BOOKING_CREATE,
    PermissionCode.BOOKING_MANAGE,

    PermissionCode.PRODUCT_READ,
    PermissionCode.PRODUCT_CREATE,
    PermissionCode.PRODUCT_UPDATE,

    PermissionCode.INVENTORY_READ,
    PermissionCode.INVENTORY_CREATE,
    PermissionCode.INVENTORY_MANAGE,

    PermissionCode.ENQUIRY_READ,
    PermissionCode.ENQUIRY_CREATE,
    PermissionCode.ENQUIRY_MANAGE,
  ],

  EMPLOYEE: [
    PermissionCode.ORGANIZATION_READ,

    PermissionCode.BRANCH_READ,

    PermissionCode.USER_READ,

    PermissionCode.CONTACT_READ,
    PermissionCode.CONTACT_CREATE,

    PermissionCode.BOOKING_READ,
    PermissionCode.BOOKING_CREATE,

    PermissionCode.PRODUCT_READ,

    PermissionCode.INVENTORY_READ,

    PermissionCode.ENQUIRY_READ,
    PermissionCode.ENQUIRY_CREATE,
    PermissionCode.ENQUIRY_MANAGE,
  ],

  VIEWER: [
    PermissionCode.ORGANIZATION_READ,
    PermissionCode.BRANCH_READ,

    PermissionCode.CONTACT_READ,
    PermissionCode.BOOKING_READ,
    PermissionCode.PRODUCT_READ,
    PermissionCode.INVENTORY_READ,
    PermissionCode.ENQUIRY_READ,
  ],
};
