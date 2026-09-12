'use client';

import { useEffect, type ReactNode } from 'react';

import { useOrganizationContext } from '@/contexts/organization/OrganizationContext';
import { INDUSTRY_REGISTRY } from '@/core/industry/industry.registry';
import { useUIStore } from '@/store/ui.store';

function toCssVariable(key: string) {
  return key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

export function IndustryThemeProvider({ children }: { children: ReactNode }) {
  const { organization } = useOrganizationContext();
  const darkMode = useUIStore((state) => state.darkMode);

  useEffect(() => {
    const root = document.documentElement;
    const definition = organization
      ? INDUSTRY_REGISTRY[organization.industry]
      : undefined;

    root.dataset.theme = darkMode ? 'dark' : 'light';

    if (!definition) {
      delete root.dataset.industry;
      return;
    }

    root.dataset.industry = definition.themeKey;

    Object.entries(definition.theme).forEach(([key, value]) => {
      root.style.setProperty(`--${toCssVariable(key)}`, value);
    });
  }, [organization, darkMode]);

  return <>{children}</>;
}
