export interface GymDashboardOverview {
  revenueMtd: number;
  activeMembers: number;
  presentToday: { present: number; total: number };
  classesInSession: { id: string; name: string; trainerName: string | null; minutesLeft: number }[];
  totalTrainers: number;
  attendanceTrend: { date: string; count: number }[];
  membershipsDue: { id: string; contactName: string; planName: string; expiresAt: string; amount: number }[];
  topSellers: { userId: string; name: string; totalSales: number }[];
  recentActivity: { id: string; action: string; entityType: string; createdAt: string }[];
}
