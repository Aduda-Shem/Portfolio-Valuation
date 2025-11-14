/**
 * Holding Model
 * Represents an asset holding within a portfolio
 */
export interface Holding {
  id: number;
  portfolio: number;
  portfolio_name?: string;
  asset_name: string;
  asset_type: string;
  quantity: string;
  unit_price: string;
  valuation_date: string;
  total_value: string;
  created_at: string;
  updated_at: string;
}

export interface CreateHoldingRequest {
  portfolio: number;
  asset_name: string;
  asset_type: string;
  quantity: string;
  unit_price: string;
  valuation_date: string;
}

export interface UpdateHoldingRequest extends Partial<CreateHoldingRequest> {
  id: number;
}

