import {
  User as PrismaUser,
  UserStatus as PrismaUserStatus,
} from '@caelix-business-os/database';

import { User } from '../domain/entities/user.entity';
import { UserStatus } from '../domain';

export class UserMapper {
  static toDomain(model: PrismaUser): User {
    return new User(
      model.id,
      model.organizationId,
      model.branchId ?? undefined,
      model.email,
      model.passwordHash,
      model.firstName,
      model.lastName,
      model.status as UserStatus,
      model.lastLoginAt ?? undefined,
    );
  }

  static toPersistence(user: User) {
    return {
      id: user.id,
      organizationId: user.organizationId,
      branchId: user.branchId ?? null,
      email: user.email,
      passwordHash: user.passwordHash,
      firstName: user.firstName,
      lastName: user.lastName,
      status: user.status as PrismaUserStatus,
      lastLoginAt: user.lastLoginAt ?? null,
    };
  }
}
