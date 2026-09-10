import { AppUser } from "@/features/auth/types";
import { apiGet, apiPatch, apiPost } from "@/lib/axios";

export const usersApi = {
  list: (organizationId: string) =>
    apiGet<AppUser[]>(`/organizations/${organizationId}/users`),

  get: (id: string) => apiGet<AppUser>(`/users/${id}`),

  invite: (
    organizationId: string,
    input: {
      email: string;
      temporaryPassword: string;
      firstName: string;
      lastName: string;
      branchId?: string;
    }
  ) => apiPost<AppUser>(`/organizations/${organizationId}/users`, input),

  assignRole: (userId: string, roleId: string) =>
    apiPatch<AppUser>(`/users/${userId}/role`, { roleId }),

  updateStatus: (userId: string, status: "ACTIVE" | "SUSPENDED") =>
    apiPatch<AppUser>(`/users/${userId}/status`, { status }),

  assignBranch: (userId: string, branchId?: string) =>
    apiPatch<AppUser>(`/users/${userId}/branch`, { branchId }),
};
