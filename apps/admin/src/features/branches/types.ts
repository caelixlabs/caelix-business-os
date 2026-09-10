export type BranchType = 'PRIMARY' | 'STANDARD';
export type BranchStatus = 'ACTIVE' | 'ARCHIVED';

export interface Branch {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  type: BranchType;
  status: BranchStatus;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}
