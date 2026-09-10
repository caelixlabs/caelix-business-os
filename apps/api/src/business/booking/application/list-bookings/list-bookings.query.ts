export interface ListBookingsQuery {
  organizationId: string;
  branchId?: string;
  contactId?: string;
  status?: string;
  from?: Date;
  to?: Date;
}