import { PrismaClient } from '@caelix-business-os/database';
import { customUUID } from '../../../apps/api/src/kernel/utility/uuid';

const prisma = new PrismaClient();

/**
 * Mirrors apps/api/src/core/rbac/domain/enums/permission-code.enum.ts.
 * Kept as plain data here (rather than imported) because packages/database
 * must not depend on apps/api — apps depend on packages, never the
 * reverse. If you add a PermissionCode there, add the matching row
 * here in the same change.
 */
const PERMISSIONS: Array<{ code: string; description: string; module: string }> = [
  { code: 'organization:read', description: 'View organization details', module: 'organization' },
  { code: 'organization:update', description: 'Update organization details', module: 'organization' },
  { code: 'organization:delete', description: 'Delete an organization', module: 'organization' },

  { code: 'branch:create', description: 'Create a branch', module: 'branch' },
  { code: 'branch:read', description: 'View branches', module: 'branch' },
  { code: 'branch:update', description: 'Update a branch', module: 'branch' },
  { code: 'branch:archive', description: 'Archive or activate a branch', module: 'branch' },
  { code: 'branch:delete', description: 'Delete a branch', module: 'branch' },

  { code: 'user:read', description: 'View users', module: 'users' },
  { code: 'user:invite', description: 'Invite a new user', module: 'users' },
  { code: 'user:suspend', description: 'Suspend or reactivate a user', module: 'users' },
  { code: 'user:role-assign', description: "Change a user's role", module: 'users' },
  { code: 'music:student-read', description: 'View music students', module: 'music' },
  { code: 'music:student-create', description: 'Create music students', module: 'music' },
  { code: 'music:student-update', description: 'Update music students', module: 'music' },
  { code: 'music:course-read', description: 'View music courses', module: 'music' },
  { code: 'music:course-manage', description: 'Manage music courses', module: 'music' },
  { code: 'music:batch-read', description: 'View music batches', module: 'music' },
  { code: 'music:batch-manage', description: 'Manage music batches', module: 'music' },
  { code: 'music:enrollment-read', description: 'View music enrollments', module: 'music' },
  { code: 'music:enrollment-manage', description: 'Manage music enrollments', module: 'music' },
  { code: 'music:attendance-read', description: 'View music attendance', module: 'music' },
  { code: 'music:attendance-manage', description: 'Manage music attendance', module: 'music' },
  { code: 'music:practice-read', description: 'View music practice logs', module: 'music' },
  { code: 'music:practice-manage', description: 'Manage music practice logs', module: 'music' },

  { code: 'contact:read', description: 'View contacts', module: 'contacts' },
  { code: 'contact:create', description: 'Create contacts', module: 'contacts' },
  { code: 'contact:update', description: 'Update contacts', module: 'contacts' },
  { code: 'contact:archive', description: 'Archive or activate a contact', module: 'contacts' },

  { code: 'booking:read', description: 'View bookings', module: 'bookings' },
  { code: 'booking:create', description: 'Create bookings', module: 'bookings' },
  { code: 'booking:manage', description: 'Confirm, cancel, or reschedule bookings', module: 'bookings' },

  { code: 'product:read', description: 'View products and services', module: 'products' },
  { code: 'product:create', description: 'Create products and services', module: 'products' },
  { code: 'product:update', description: 'Update products and services', module: 'products' },
  { code: 'product:archive', description: 'Archive or activate a product', module: 'products' },

  { code: 'inventory:read', description: 'View inventory levels', module: 'inventory' },
  { code: 'inventory:create', description: 'Create inventory records', module: 'inventory' },
  { code: 'inventory:manage', description: 'Adjust stock and archive inventory records', module: 'inventory' },

  { code: 'enquiry:read', description: 'View enquiries', module: 'enquiries' },
  { code: 'enquiry:create', description: 'Create enquiries', module: 'enquiries' },
  { code: 'enquiry:manage', description: 'Update enquiry status and assignment', module: 'enquiries' },
];

async function main() {
  for (const permission of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { code: permission.code },
      update: { description: permission.description, module: permission.module },
      create: {
        id: customUUID.generate(),
        code: permission.code,
        description: permission.description,
        module: permission.module,
      },
    });
  }

  console.log(`[seed] Upserted ${PERMISSIONS.length} permissions.`);
  console.log(
    '[seed] NOTE: this only seeds the global Permission catalogue. Organizations created ' +
      'before this seed ran will have roles with zero granted permissions — re-run ' +
      'SeedOrganizationRolesHandler logic for those orgs, or simply have an OWNER ' +
      're-trigger role seeding via a future admin action.',
  );
}

main()
  .catch((error) => {
    console.error('[seed] Failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
