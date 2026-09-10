import { Industry } from "@/industry/industry.enum";


export interface WorkspaceRecord {
  id: string;
  organizationId: string;
  industry: Industry;
  features: string[];
}

export interface WorkspaceRepository {
  findByOrganization(organizationId: string): Promise<WorkspaceRecord | null>;
  upsert(organizationId: string, industry: Industry, features: string[]): Promise<WorkspaceRecord>;
}
