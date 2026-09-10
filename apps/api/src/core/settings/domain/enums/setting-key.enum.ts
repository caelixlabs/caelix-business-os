/**
 * Canonical, typed set of organization settings. Deliberately a fixed
 * enum rather than free-form keys: every industry vertical the PRD
 * targets (gyms, clinics, academies, salons...) needs these same
 * handful of cross-cutting preferences, so keeping the set closed and
 * typed catches typos at compile time instead of silently no-op'ing
 * on a misspelled key.
 */
export enum SettingKey {
  TIMEZONE = 'timezone',
  CURRENCY = 'currency',
  DATE_FORMAT = 'dateFormat',
  WEEK_START = 'weekStart',
}

export const SETTING_DEFAULTS: Record<SettingKey, string> = {
  [SettingKey.TIMEZONE]: 'UTC',
  [SettingKey.CURRENCY]: 'USD',
  [SettingKey.DATE_FORMAT]: 'YYYY-MM-DD',
  [SettingKey.WEEK_START]: 'monday',
};
