import { format as dateFnsFormat } from 'date-fns';

/**
 * Format currency amount
 */
export function formatCurrency(amount: number, currency: string = 'VND'): string {
  if (currency === 'VND') {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format large numbers with K, M suffixes
 */
export function formatCompactNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toString();
}

/**
 * Format date
 */
export function formatDate(date: Date | string, formatStr: string = 'MMM dd, yyyy'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateFnsFormat(dateObj, formatStr);
}

/**
 * Format relative time (Today, Yesterday, etc.)
 */
export function formatRelativeDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (dateObj.toDateString() === today.toDateString()) {
    return 'Today';
  }
  if (dateObj.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  return formatDate(dateObj, 'MMM dd');
}

/**
 * Parse number from string (handles K, M suffixes)
 */
export function parseNumberInput(input: string): number {
  const cleaned = input.replace(/[^0-9.,KMkm]/g, '');
  const lower = cleaned.toLowerCase();

  if (lower.includes('k')) {
    return parseFloat(lower.replace('k', '')) * 1000;
  }
  if (lower.includes('m')) {
    return parseFloat(lower.replace('m', '')) * 1_000_000;
  }

  return parseFloat(cleaned.replace(/,/g, '')) || 0;
}
