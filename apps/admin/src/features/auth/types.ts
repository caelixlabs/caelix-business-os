export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'INVITED' | 'SUSPENDED';

export type RoleLevel = 'OWNER' | 'ADMIN' | 'MANAGER' | 'EMPLOYEE' | 'VIEWER';

export interface RoleSummary {
  id: string;
  name: string;
  level: RoleLevel;
  permissions: string[];
}

export interface LoginPayload {
  organizationSlug: string;
  email: string;
  password: string;
}

export interface RegisterPayload {
  organizationId: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AppUser {
  id: string;
  organizationId: string;
  branchId?: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  status: UserStatus;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
  role?: RoleSummary;
  roles: string[];
  permissions: string[];
}

export interface AuthResponse {
  user: AppUser;
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  roles: string[];
  permissions: string[];
}