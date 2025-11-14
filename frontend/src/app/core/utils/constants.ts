/**
 * Application Constants
 * Centralized constants following DRY principle
 */
export const COLORS = {
  PRIMARY: '#003781',
  PRIMARY_DARK: '#002d5f',
  SUCCESS: '#16a34a',
  SUCCESS_DARK: '#15803d',
  WARNING: '#eab308',
  ERROR: '#dc2626',
} as const;

export const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  CONFIRMED: 'bg-green-600 text-white border-transparent',
  ARCHIVED: 'bg-gray-200 text-gray-600 border-gray-400',
};

export const ASSET_TYPES = [
  { value: 'STOCK', label: 'Stock' },
  { value: 'BOND', label: 'Bond' },
  { value: 'CASH', label: 'Cash' },
  { value: 'ETF', label: 'ETF' },
  { value: 'MUTUAL_FUND', label: 'Mutual Fund' },
  { value: 'OTHER', label: 'Other' },
] as const;

