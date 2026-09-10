import {
  INDUSTRIES,
  type IndustryType,
} from '../constants/industries';

export function filterIndustries(keyword: string) {
  const search = keyword.trim().toLowerCase();

  if (!search) {
    return INDUSTRIES;
  }

  return INDUSTRIES.filter(
    (industry) =>
      industry.label.toLowerCase().includes(search) ||
      industry.value.toLowerCase().includes(search),
  );
}

export function getIndustryByValue(value: IndustryType) {
  return INDUSTRIES.find((industry) => industry.value === value);
}

export function getIndustryByLabel(label: string) {
  return INDUSTRIES.find((industry) => industry.label === label);
}

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}