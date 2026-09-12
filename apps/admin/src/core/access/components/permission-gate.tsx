"use client";

import type { ReactNode } from "react";

import { usePermission } from "@/core/access/hooks/use-permission";

interface PermissionGateProps {
  permission?: string;
  permissions?: string[];
  mode?: "any" | "all";
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGate({
  permission,
  permissions,
  mode = "any",
  children,
  fallback = null,
}: PermissionGateProps) {
  const { has, hasAny, hasAll } = usePermission();
  let allowed = false;

  if (permission) {
    allowed = has(permission);
  } else if (permissions && permissions.length > 0) {
    allowed = mode === "all" ? hasAll(permissions) : hasAny(permissions);
  }

  if (!allowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
  