import type { ComponentType } from 'react';

import type { NavigationGroup } from '@/core/navigation/navigation.types';
import {
  GYM_NAV_GROUPS,
  MUSIC_ORG_NAV_GROUPS,
  SALON_NAV_GROUPS,
} from '@/core/navigation/navigation.registry';

import { GYM_THEME } from '@/theme/industries/gym';
import { MUSIC_ORG_THEME } from '@/theme/industries/music-org';
import { SALON_THEME } from '@/theme/industries/salon';
import type { IndustryType } from '@/core/industry/industry.types';

export type { IndustryType };

export interface IndustryDefinition {
  value: IndustryType;
  label: string;
  description: string;
  icon: string;
  themeKey: string;
  theme: Record<string, string>;
  navigationGroups: NavigationGroup[];
  dashboard: () => Promise<{
    default: ComponentType;
  }>;
}

export const INDUSTRY_REGISTRY: Record<
  IndustryType,
  IndustryDefinition
> = {
  MUSIC_ORG: {
    value: 'MUSIC_ORG',
    label: 'Music Organization',
    description:
      'Music academies, schools, and training centres',
    icon: 'music',
    themeKey: 'MUSIC_ORG',
    theme: MUSIC_ORG_THEME,
    navigationGroups: MUSIC_ORG_NAV_GROUPS,
    dashboard: () =>
      import(
        '@/industries/music-org/dashboard/MusicOrgDashboard'
      ).then((module) => ({
        default: module.MusicOrgDashboard,
      })),
  },

  GYM: {
    value: 'GYM',
    label: 'Gym & Fitness',
    description:
      'Gyms, fitness centres, yoga and training studios',
    icon: 'dumbbell',
    themeKey: 'GYM',
    theme: GYM_THEME,
    navigationGroups: GYM_NAV_GROUPS,
    dashboard: () =>
      import(
        '@/industries/gym/dashboard/GymDashboard'
      ).then((module) => ({
        default: module.GymDashboard,
      })),
  },

  SALON: {
    value: 'SALON',
    label: 'Salon & Spa',
    description:
      'Hair, beauty, and wellness salons and spas',
    icon: 'scissors',
    themeKey: 'SALON',
    theme: SALON_THEME,
    navigationGroups: SALON_NAV_GROUPS,
    dashboard: () =>
      import(
        '@/industries/salon/dashboard/SalonDashboard'
      ).then((module) => ({
        default: module.SalonDashboard,
      })),
  },
};

export const INDUSTRIES =
  Object.values(INDUSTRY_REGISTRY);