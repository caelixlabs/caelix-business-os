export type DashboardWidgetPrefs = Record<string, boolean>;

export interface DashboardWidgetOption {
  key: string;
  label: string;
  group: 'Key metrics' | 'Panels';
}

// Frontend-only display metadata — the backend is the source of truth
// for which keys actually exist per industry; this just labels them.
// Keyed the same way as IndustryType so DashboardWidgetsForm can look
// up the right catalog for the org it's rendering for.
export const DASHBOARD_WIDGET_OPTIONS_BY_INDUSTRY: Record<string, DashboardWidgetOption[]> = {
  MUSIC_ORG: [
    { key: 'revenue', label: 'Revenue (MTD)', group: 'Key metrics' },
    { key: 'activeStudents', label: 'Active students', group: 'Key metrics' },
    { key: 'presentToday', label: 'Present today', group: 'Key metrics' },
    { key: 'classesInSession', label: 'Classes in session', group: 'Key metrics' },
    { key: 'totalTeachers', label: 'Total teachers', group: 'Key metrics' },
    { key: 'newLeads', label: 'New leads', group: 'Key metrics' },
    { key: 'leadsPipeline', label: 'Leads pipeline', group: 'Panels' },
    { key: 'teachersRightNow', label: 'Teachers right now', group: 'Panels' },
    { key: 'attendanceTrend', label: 'Attendance trend', group: 'Panels' },
    { key: 'renewalsDue', label: 'Renewals due', group: 'Panels' },
    { key: 'recentActivity', label: 'Recent activity', group: 'Panels' },
  ],
  GYM: [
    { key: 'revenue', label: 'Revenue (MTD)', group: 'Key metrics' },
    { key: 'activeMembers', label: 'Active members', group: 'Key metrics' },
    { key: 'presentToday', label: 'Present today', group: 'Key metrics' },
    { key: 'classesInSession', label: 'Classes in session', group: 'Key metrics' },
    { key: 'totalTrainers', label: 'Total trainers', group: 'Key metrics' },
    { key: 'classesLiveNow', label: 'Classes live now', group: 'Panels' },
    { key: 'attendanceTrend', label: 'Attendance trend', group: 'Panels' },
    { key: 'membershipsDue', label: 'Memberships due', group: 'Panels' },
    { key: 'topSellers', label: 'Top sellers', group: 'Panels' },
    { key: 'recentActivity', label: 'Recent activity', group: 'Panels' },
  ],
};
