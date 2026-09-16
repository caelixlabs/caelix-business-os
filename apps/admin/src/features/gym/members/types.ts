export type GymMemberStatus = 'ACTIVE' | 'INACTIVE' | 'FROZEN' | 'CANCELLED';

export interface GymMember {
  id: string;
  contactId: string;
  branchId?: string;
  memberNo: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  status: GymMemberStatus;
  joinedAt: string;
  notes?: string;
}
