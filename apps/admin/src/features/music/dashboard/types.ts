export interface MusicDashboardOverview {
  revenueMtd: number;
  activeStudents: number;
  presentToday: { present: number; total: number };
  classesInSession: { id: string; name: string; teacherName: string | null; minutesLeft: number }[];
  totalTeachers: number;
  leads: { total: number; converted: number; byStatus: Record<string, number> };
  attendanceTrend: { date: string; count: number }[];
  renewalsDue: { id: string; contactName: string; planName: string; expiresAt: string; amount: number }[];
  recentActivity: { id: string; action: string; entityType: string; createdAt: string }[];
}
