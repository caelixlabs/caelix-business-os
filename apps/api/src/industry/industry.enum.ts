export enum Industry {
  GENERAL = 'GENERAL',
  MUSIC_Org = 'MUSIC_Org',
  GYM = 'GYM',
  SALON = 'SALON',
  CLINIC = 'CLINIC',
  RESTAURANT = 'RESTAURANT',
  SCHOOL = 'SCHOOL',
  RETAIL = 'RETAIL',
}

/**
 * Feature keys that the frontend uses to decide which nav items to
 * show and which pages to enable. Every industry gets the "core"
 * features; industry-specific features are additive on top.
 */
export enum FeatureKey {
  // Core — every industry
  CUSTOMERS = 'customers',
  PRODUCTS = 'products',
  ORDERS = 'orders',
  INVOICES = 'invoices',
  BOOKINGS = 'bookings',
  REPORTS = 'reports',

  // Music Org
  STUDENTS = 'students',
  COURSES = 'courses',
  BATCHES = 'batches',
  ATTENDANCE = 'attendance',
  PRACTICE_LOG = 'practice_log',

  // Gym
  MEMBERSHIPS = 'memberships',
  MEMBERSHIP_PLANS = 'membership_plans',
  GYM_CLASSES = 'gym_classes',
  CHECK_INS = 'check_ins',
}

const CORE_FEATURES = [
  FeatureKey.CUSTOMERS,
  FeatureKey.PRODUCTS,
  FeatureKey.ORDERS,
  FeatureKey.INVOICES,
  FeatureKey.BOOKINGS,
  FeatureKey.REPORTS,
];

/**
 * The single source of truth for which features each industry gets.
 * Adding a new industry means adding one entry here — no other code
 * needs to change.
 */
export const INDUSTRY_FEATURES: Record<Industry, FeatureKey[]> = {
  [Industry.GENERAL]: CORE_FEATURES,

  [Industry.MUSIC_Org]: [
    ...CORE_FEATURES,
    FeatureKey.STUDENTS,
    FeatureKey.COURSES,
    FeatureKey.BATCHES,
    FeatureKey.ATTENDANCE,
    FeatureKey.PRACTICE_LOG,
  ],

  [Industry.GYM]: [
    ...CORE_FEATURES,
    FeatureKey.MEMBERSHIPS,
    FeatureKey.MEMBERSHIP_PLANS,
    FeatureKey.GYM_CLASSES,
    FeatureKey.CHECK_INS,
  ],

  [Industry.SALON]: [...CORE_FEATURES],
  [Industry.CLINIC]: [...CORE_FEATURES],
  [Industry.RESTAURANT]: [...CORE_FEATURES],
  [Industry.SCHOOL]: [...CORE_FEATURES],
  [Industry.RETAIL]: [...CORE_FEATURES],
};