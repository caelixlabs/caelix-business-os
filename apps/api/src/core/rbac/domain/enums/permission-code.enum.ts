/**
 * Canonical permission codes, module:action. This is the single
 * source of truth consumed by both the RBAC seed handler (which
 * grants codes to system roles) and @RequirePermissions() decorators
 * on controllers — never hand-type a permission string at a call
 * site.
 */
export enum PermissionCode {
  ORGANIZATION_READ = 'organization:read',
  ORGANIZATION_UPDATE = 'organization:update',
  ORGANIZATION_DELETE = 'organization:delete',

  BRANCH_CREATE = 'branch:create',
  BRANCH_READ = 'branch:read',
  BRANCH_UPDATE = 'branch:update',
  BRANCH_ARCHIVE = 'branch:archive',
  BRANCH_DELETE = 'branch:delete',

  USER_READ = 'user:read',
  USER_INVITE = 'user:invite',
  USER_UPDATE = 'user:update',
  USER_SUSPEND = 'user:suspend',
  USER_ROLE_ASSIGN = 'user:role-assign',
  
  MUSIC_STUDENT_READ = 'music:student-read',
  MUSIC_STUDENT_CREATE = 'music:student-create',
  MUSIC_STUDENT_UPDATE = 'music:student-update',
  MUSIC_COURSE_READ = 'music:course-read',
  MUSIC_COURSE_MANAGE = 'music:course-manage',
  MUSIC_BATCH_READ = 'music:batch-read',
  MUSIC_BATCH_MANAGE = 'music:batch-manage',
  MUSIC_ENROLLMENT_READ = 'music:enrollment-read',
  MUSIC_ENROLLMENT_MANAGE = 'music:enrollment-manage',
  MUSIC_ATTENDANCE_READ = 'music:attendance-read',
  MUSIC_ATTENDANCE_MANAGE = 'music:attendance-manage',
  MUSIC_PRACTICE_READ = 'music:practice-read',
  MUSIC_PRACTICE_MANAGE ='music:practice-manage',

  GYM_MEMBER_READ = 'gym:member-read',
  GYM_MEMBER_CREATE = 'gym:member-create',
  GYM_MEMBER_UPDATE = 'gym:member-update',
  GYM_CLASS_READ = 'gym:class-read',
  GYM_CLASS_MANAGE = 'gym:class-manage',
  GYM_TRAINER_READ = 'gym:trainer-read',
  GYM_TRAINER_MANAGE = 'gym:trainer-manage',
  GYM_MEMBERSHIP_READ = 'gym:membership-read',
  GYM_MEMBERSHIP_MANAGE = 'gym:membership-manage',
  GYM_ATTENDANCE_READ = 'gym:attendance-read',
  GYM_ATTENDANCE_MANAGE = 'gym:attendance-manage',

  CONTACT_READ = 'contact:read',
  CONTACT_CREATE = 'contact:create',
  CONTACT_UPDATE = 'contact:update',
  CONTACT_ARCHIVE = 'contact:archive',

  BOOKING_READ = 'booking:read',
  BOOKING_CREATE = 'booking:create',
  BOOKING_MANAGE = 'booking:manage',

  PRODUCT_READ = 'product:read',
  PRODUCT_CREATE = 'product:create',
  PRODUCT_UPDATE = 'product:update',
  PRODUCT_ARCHIVE = 'product:archive',

  INVENTORY_READ = 'inventory:read',
  INVENTORY_CREATE = 'inventory:create',
  INVENTORY_MANAGE = 'inventory:manage',

  ENQUIRY_READ = 'enquiry:read',
  ENQUIRY_CREATE = 'enquiry:create',
  ENQUIRY_MANAGE = 'enquiry:manage',

  INVOICE_READ = 'invoice:read',
  INVOICE_CREATE = 'invoice:create',
  INVOICE_MANAGE = 'invoice:manage',

  PAYMENT_READ = 'payment:read',
  PAYMENT_RECORD = 'payment:record',

  DOCUMENT_READ = 'document:read',
  DOCUMENT_CREATE = 'document:create',
  DOCUMENT_DELETE = 'document:delete',

  REPORT_READ = 'report:read',

  MEMBERSHIP_PLAN_READ = 'membership:plan-read',
  MEMBERSHIP_PLAN_MANAGE = 'membership:plan-manage',
  MEMBERSHIP_SUBSCRIPTION_READ = 'membership:subscription-read',
  MEMBERSHIP_SUBSCRIPTION_MANAGE = 'membership:subscription-manage',

  POS_SELL = 'pos:sell',
  POS_READ = 'pos:read',
  POS_REFUND = 'pos:refund',
}
