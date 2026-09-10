export const INDUSTRIES = [
  {
    value: 'MUSIC_ORG',
    label: 'Music Organization',
  },
  {
    value: 'GYM',
    label: 'Gym',
  },
] as const;

export type IndustryType = (typeof INDUSTRIES)[number]['value'];