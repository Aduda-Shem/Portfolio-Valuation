/**
 * Portfolio Model
 * Represents an investment portfolio for a client
 */
export interface Portfolio {
  id: number;
  name: string;
  client_name: string;
  client_email: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePortfolioRequest {
  name: string;
  client_name: string;
  client_email: string;
  description?: string;
}

export interface UpdatePortfolioRequest extends Partial<CreatePortfolioRequest> {
  id: number;
}

