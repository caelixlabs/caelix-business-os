const DASHBOARD_ROOT = '/dashboard';

export const PATHS = {
  root: '/',
  auth: {
    login: '/login',
    signup: '/signup',
  },
  dashboard: DASHBOARD_ROOT,
  profile: `${DASHBOARD_ROOT}/profile`,
  branches: `${DASHBOARD_ROOT}/branches`,
  users: `${DASHBOARD_ROOT}/users`,
  roles: `${DASHBOARD_ROOT}/roles`,
  auditLog: `${DASHBOARD_ROOT}/audit-log`,
  notifications: `${DASHBOARD_ROOT}/notifications`,
  settings: `${DASHBOARD_ROOT}/settings`,
  pos: `${DASHBOARD_ROOT}/pos`,
  music: {
    root: `${DASHBOARD_ROOT}/music`,
    calendar: `${DASHBOARD_ROOT}/music/calendar`,
    students: `${DASHBOARD_ROOT}/music/students`,
    teachers: `${DASHBOARD_ROOT}/music/teachers`,
    courses: `${DASHBOARD_ROOT}/music/courses`,
    batches: `${DASHBOARD_ROOT}/music/batches`,
    subscriptions: `${DASHBOARD_ROOT}/music/subscriptions`,
    enquiries: `${DASHBOARD_ROOT}/enquiries`,
  },
  gym: {
    root: `${DASHBOARD_ROOT}/gym`,
    members: `${DASHBOARD_ROOT}/gym/members`,
    classes: `${DASHBOARD_ROOT}/gym/classes`,
    trainers: `${DASHBOARD_ROOT}/gym/trainers`,
    memberships: `${DASHBOARD_ROOT}/gym/memberships`,
    attendance: `${DASHBOARD_ROOT}/gym/attendance`,
  },
  salon: {
    root: `${DASHBOARD_ROOT}/salon`,
    stylists: `${DASHBOARD_ROOT}/salon/stylists`,
  },
} as const;
