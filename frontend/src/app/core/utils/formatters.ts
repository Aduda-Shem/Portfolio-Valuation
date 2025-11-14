import { format } from 'date-fns';

/**
 * Formatter Utilities
 */
export class Formatters {
  /**
   * Formats a date string or Date object to a readable format
   */
  static formatDate(date: string | Date, formatStr: string = 'MMM dd, yyyy'): string {
    try {
      return format(new Date(date), formatStr);
    } catch (error) {
      return 'Invalid Date';
    }
  }

  /**
   * Formats a number with locale-specific formatting
   */
  static formatNumber(value: string | number): string {
    try {
      return parseFloat(String(value)).toLocaleString();
    } catch (error) {
      return '0';
    }
  }

  /**
   * Formats currency value in KES (Kenyan Shillings)
   */
  static formatCurrency(value: string | number): string {
    try {
      const numValue = parseFloat(String(value));
      // Format with KES currency symbol
      return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(numValue);
    } catch (error) {
      // Fallback formatting if locale is not supported
      try {
        const numValue = parseFloat(String(value));
        return `KES ${numValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      } catch {
        return 'KES 0.00';
      }
    }
  }
}

