export const renderTemplate = (template: string, variables: Record<string, string>) =>
  template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, name: string) => variables[name] ?? "");

export const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);

/** Best-effort E.164: keeps an explicit "+", otherwise strips formatting and prepends the default country code. */
export function normalizePhone(raw: string, defaultCountryCode: string): string {
  const trimmed = raw.trim();
  const digits = trimmed.replace(/\D/g, "");
  if (trimmed.startsWith("+")) return `+${digits}`;
  return `${defaultCountryCode}${digits.replace(/^0+/, "")}`;
}
