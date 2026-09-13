export type EnquirySource = 'WEBSITE' | 'PHONE' | 'EMAIL' | 'WALK_IN' | 'REFERRAL' | 'SOCIAL_MEDIA' | 'OTHER';
export type EnquiryStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';

export interface Enquiry {
  id: string;
  organizationId: string;
  branchId?: string;
  contactId: string;
  assignedUserId?: string;
  source: EnquirySource;
  subject: string;
  description?: string;
  status: EnquiryStatus;
}
