export type BookingStatus = 'DRAFT' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Booking {
  id: string;
  organizationId: string;
  branchId?: string;
  contactId: string;
  scheduledAt: string;
  notes?: string;
  status: BookingStatus;
}
