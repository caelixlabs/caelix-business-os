export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  industry: 'MUSIC_ORG' | 'GYM';
  createdAt: string;
  updatedAt: string;
}
