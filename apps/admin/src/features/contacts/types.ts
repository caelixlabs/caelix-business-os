export type ContactType = 'PERSON' | 'BUSINESS';
export type ContactStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export interface Contact {
  id: string;
  organizationId: string;
  branchId?: string;
  type: ContactType;
  status: ContactStatus;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  email?: string;
  phone?: string;
  notes?: string;
}
