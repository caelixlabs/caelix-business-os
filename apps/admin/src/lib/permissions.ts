export function hasPermission(
  permissions: string[] | undefined,
  required: string
): boolean {
  return Boolean(permissions?.includes(required));
}

export function hasAnyPermission(
  permissions: string[] | undefined,
  required: string[]
): boolean {
  if (!permissions || permissions.length === 0) {
    return false;
  }

  return required.some((permission) => permissions.includes(permission));
}

export function hasAllPermissions(
  permissions: string[] | undefined,
  required: string[]
): boolean {
  if (!permissions || permissions.length === 0) {
    return false;
  }

  return required.every((permission) => permissions.includes(permission));
}
