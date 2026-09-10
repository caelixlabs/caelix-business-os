import { RoleSummary } from '@/core/rbac/domain';
import { User } from '../../domain/entities/user.entity';

/**
 * Public shape of a User returned by the API. Deliberately excludes
 * passwordHash — the domain entity carries it because password
 * verification happens inside the domain/application layer, but it
 * must never be serialized back to a client.
 */
export class UserResponseDto {
  id!: string;
  organizationId!: string;
  branchId?: string;
  email!: string;
  firstName!: string;
  lastName!: string;
  fullName!: string;
  status!: string;
  lastLoginAt?: Date;
  role?: RoleSummary;

  static fromDomain(user: User, role?: RoleSummary | null): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.organizationId = user.organizationId;
    dto.branchId = user.branchId;
    dto.email = user.email;
    dto.firstName = user.firstName;
    dto.lastName = user.lastName;
    dto.fullName = user.fullName;
    dto.status = user.status;
    dto.lastLoginAt = user.lastLoginAt;
    dto.role = role ?? undefined;
    return dto;
  }
}
