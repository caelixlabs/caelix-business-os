import { IndustryType } from '@/core/organization/domain/enums/industry-type.enum';
import { MUSIC_ORG_PERMISSIONS_BY_LEVEL } from '@/industry/music-org/music-org.permissions';
import { PermissionCode } from './enums/permission-code.enum';
import { RoleLevel } from './enums/role-level.enum';

/**
 * Additional permissions each organization's system roles receive on top
 * of ROLE_PERMISSION_MATRIX, based on the organization's industry.
 * Consumed by SeedOrganizationRolesHandler. Add an entry here whenever a
 * new industry module ships its own permission codes.
 */
export const INDUSTRY_PERMISSION_MATRIX: Partial<
  Record<IndustryType, Record<RoleLevel, PermissionCode[]>>
> = {
  [IndustryType.MUSIC_ORG]: MUSIC_ORG_PERMISSIONS_BY_LEVEL,
};
