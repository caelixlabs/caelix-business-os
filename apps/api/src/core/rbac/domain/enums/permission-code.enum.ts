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
}
