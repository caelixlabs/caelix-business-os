export function formatCurrency(
  amount: number,
  currency = 'INR',
) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(
  date: string | Date,
  format: 'short' | 'long' | 'relative' = 'short',
) {
  const value = new Date(date);

  if (format === 'relative') {
    return formatRelativeTime(value);
  }

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: format,
  }).format(value);
}

export function formatRelativeTime(date: string | Date) {
  const value = new Date(date).getTime();
  const diff = value - Date.now();
  const minutes = Math.round(diff / 60000);
  const hours = Math.round(diff / 3600000);
  const days = Math.round(diff / 86400000);

  if (Math.abs(minutes) < 60) {
    return new Intl.RelativeTimeFormat('en', {
      numeric: 'auto',
    }).format(minutes, 'minute');
  }

  if (Math.abs(hours) < 24) {
    return new Intl.RelativeTimeFormat('en', {
      numeric: 'auto',
    }).format(hours, 'hour');
  }

  return new Intl.RelativeTimeFormat('en', {
    numeric: 'auto',
  }).format(days, 'day');
}

export function formatCount(value: number) {
  return new Intl.NumberFormat('en-IN', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}
