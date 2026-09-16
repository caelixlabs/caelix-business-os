export type GymClassStatus = 'ACTIVE' | 'INACTIVE';

export interface GymClass {
  id: string;
  branchId: string;
  trainerUserId?: string;
  name: string;
  capacity: number;
  startDate: string;
  endDate?: string;
  days: string[];
  startTime: string;
  endTime: string;
  status: GymClassStatus;
}
