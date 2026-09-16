import { MODULES } from '@/configs/modules';
import type { NavigationGroup, NavigationItem } from './navigation.types';

function isModuleEnabled(moduleKey?: string) {
  if (!moduleKey) return true;
  const enabled = MODULES[moduleKey as keyof typeof MODULES] as boolean;
  return enabled !== false;
}

function resolveItem(
  item: NavigationItem,
  industry: string | undefined,
  hasPermission: (permission: string) => boolean,
) {
  if (item.industry && item.industry !== industry) return false;
  if (!isModuleEnabled(item.moduleKey)) return false;
  if (item.permission && !hasPermission(item.permission)) return false;
  return true;
}

export function resolveNavigationGroups(
  groups: NavigationGroup[],
  industry: string | undefined,
  hasPermission: (permission: string) => boolean,
) {
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        resolveItem(item, industry, hasPermission),
      ),
    }))
    .filter((group) => group.items.length > 0);
}
