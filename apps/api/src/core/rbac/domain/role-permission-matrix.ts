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

    PermissionCode.INVOICE_READ,
    PermissionCode.INVOICE_CREATE,
    PermissionCode.INVOICE_MANAGE,

    PermissionCode.PAYMENT_READ,
    PermissionCode.PAYMENT_RECORD,

    PermissionCode.DOCUMENT_READ,
    PermissionCode.DOCUMENT_CREATE,
    PermissionCode.DOCUMENT_DELETE,

    PermissionCode.REPORT_READ,

    PermissionCode.MEMBERSHIP_PLAN_READ,
    PermissionCode.MEMBERSHIP_PLAN_MANAGE,
    PermissionCode.MEMBERSHIP_SUBSCRIPTION_READ,
    PermissionCode.MEMBERSHIP_SUBSCRIPTION_MANAGE,

    PermissionCode.POS_SELL,
    PermissionCode.POS_READ,
    PermissionCode.POS_REFUND,
    PermissionCode.AUTOMATION_READ,
    PermissionCode.AUTOMATION_MANAGE,
    PermissionCode.COMMUNICATION_READ,
    PermissionCode.COMMUNICATION_SEND,
    PermissionCode.COMMUNICATION_MANAGE,
    PermissionCode.SIGNATURE_READ,
    PermissionCode.SIGNATURE_MANAGE,
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

    PermissionCode.INVOICE_READ,
    PermissionCode.INVOICE_CREATE,
    PermissionCode.INVOICE_MANAGE,

    PermissionCode.PAYMENT_READ,
    PermissionCode.PAYMENT_RECORD,

    PermissionCode.DOCUMENT_READ,
    PermissionCode.DOCUMENT_CREATE,
    PermissionCode.DOCUMENT_DELETE,

    PermissionCode.REPORT_READ,

    PermissionCode.MEMBERSHIP_PLAN_READ,
    PermissionCode.MEMBERSHIP_PLAN_MANAGE,
    PermissionCode.MEMBERSHIP_SUBSCRIPTION_READ,
    PermissionCode.MEMBERSHIP_SUBSCRIPTION_MANAGE,

    PermissionCode.POS_SELL,
    PermissionCode.POS_READ,
    PermissionCode.POS_REFUND,
    PermissionCode.AUTOMATION_READ,
    PermissionCode.AUTOMATION_MANAGE,
    PermissionCode.COMMUNICATION_READ,
    PermissionCode.COMMUNICATION_SEND,
    PermissionCode.COMMUNICATION_MANAGE,
    PermissionCode.SIGNATURE_READ,
    PermissionCode.SIGNATURE_MANAGE,
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

    PermissionCode.INVOICE_READ,
    PermissionCode.INVOICE_CREATE,
    PermissionCode.INVOICE_MANAGE,

    PermissionCode.PAYMENT_READ,
    PermissionCode.PAYMENT_RECORD,

    PermissionCode.DOCUMENT_READ,
    PermissionCode.DOCUMENT_CREATE,

    PermissionCode.REPORT_READ,

    PermissionCode.MEMBERSHIP_PLAN_READ,
    PermissionCode.MEMBERSHIP_PLAN_MANAGE,
    PermissionCode.MEMBERSHIP_SUBSCRIPTION_READ,
    PermissionCode.MEMBERSHIP_SUBSCRIPTION_MANAGE,

    PermissionCode.POS_SELL,
    PermissionCode.POS_READ,
    PermissionCode.POS_REFUND,
    PermissionCode.AUTOMATION_READ,
    PermissionCode.COMMUNICATION_READ,
    PermissionCode.COMMUNICATION_SEND,
    PermissionCode.SIGNATURE_READ,
    PermissionCode.SIGNATURE_MANAGE,
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

    PermissionCode.INVOICE_READ,
    PermissionCode.INVOICE_CREATE,

    PermissionCode.PAYMENT_READ,
    PermissionCode.PAYMENT_RECORD,

    PermissionCode.DOCUMENT_READ,
    PermissionCode.DOCUMENT_CREATE,

    PermissionCode.REPORT_READ,

    PermissionCode.MEMBERSHIP_PLAN_READ,
    PermissionCode.MEMBERSHIP_SUBSCRIPTION_READ,

    PermissionCode.POS_SELL,
    PermissionCode.POS_READ,
    PermissionCode.COMMUNICATION_READ,
    PermissionCode.COMMUNICATION_SEND,
    PermissionCode.SIGNATURE_READ,
  ],

  VIEWER: [
    PermissionCode.ORGANIZATION_READ,
    PermissionCode.BRANCH_READ,

    PermissionCode.CONTACT_READ,
    PermissionCode.BOOKING_READ,
    PermissionCode.PRODUCT_READ,
    PermissionCode.INVENTORY_READ,
    PermissionCode.ENQUIRY_READ,

    PermissionCode.INVOICE_READ,
    PermissionCode.PAYMENT_READ,

    PermissionCode.DOCUMENT_READ,

    PermissionCode.REPORT_READ,

    PermissionCode.MEMBERSHIP_PLAN_READ,
    PermissionCode.MEMBERSHIP_SUBSCRIPTION_READ,

    PermissionCode.POS_READ,
  ],
};
