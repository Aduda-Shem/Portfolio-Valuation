/**
 * API Response Models
 */
export interface ApiResponse<T> {
  message: string;
  portfolios?: T[];
  holdings?: T[];
  valuations?: T[];
  portfolio?: T;
  holding?: T;
  valuation?: T;
  statistics?: any;
  current_page: number;
  last_page: number;
  total: number;
}

