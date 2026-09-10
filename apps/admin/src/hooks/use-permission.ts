import { useAuthStore } from "@/store/auth.store";

import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
} from "@/lib/permissions";

export function usePermission() {
  const permissions = useAuthStore((state) => state.permissions ?? []);

  return {
    permissions,
    has: (permission: string) => hasPermission(permissions, permission),
    hasAny: (required: string[]) => hasAnyPermission(permissions, required),
    hasAll: (required: string[]) => hasAllPermissions(permissions, required),
  };
}
