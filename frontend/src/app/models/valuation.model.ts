/**
 * Valuation Snapshot Model
 * Represents a snapshot of portfolio value at a specific date
 */
export type ValuationStatus = 'DRAFT' | 'CONFIRMED' | 'ARCHIVED';

export interface ValuationSnapshot {
  id: number;
  portfolio: number;
  portfolio_name?: string;
  snapshot_date: string;
  status: ValuationStatus;
  total_aum: string | null;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateValuationRequest {
  portfolio: number;
  snapshot_date: string;
  status?: ValuationStatus;
  notes?: string;
}

export interface UpdateValuationRequest extends Partial<CreateValuationRequest> {
  id: number;
}

export interface UpdateValuationStatusRequest {
  status: ValuationStatus;
}

