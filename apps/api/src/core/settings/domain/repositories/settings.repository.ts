import { SettingKey } from "../enums";

export type SettingsMap = Partial<Record<SettingKey, string>>;

/**
 * Settings are plain key-value reference data scoped to an
 * organization — no domain events, no invariants beyond "value is a
 * string". Defaults (SETTING_DEFAULTS) are applied at the application
 * layer for any key that has never been explicitly set, so callers
 * always get a complete map rather than having to handle "missing".
 */
export interface SettingsRepository {
  getAll(organizationId: string): Promise<SettingsMap>;
  setMany(organizationId: string, values: SettingsMap): Promise<void>;
}