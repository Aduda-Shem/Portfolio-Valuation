import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Portfolio } from '../../models/portfolio.model';

/**
 * Portfolio State Interface
 */
export interface PortfolioState extends EntityState<Portfolio> {
  currentPortfolio: Portfolio | null;
  loading: boolean;
  error: string | null;
}

/**
 * Portfolio Store
 * Manages portfolio state using Akita Entity Store
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'portfolios' })
export class PortfolioStore extends EntityStore<PortfolioState> {
  constructor() {
    super({
      currentPortfolio: null,
      loading: false,
      error: null,
    });
  }

  override setLoading(loading: boolean): void {
    this.update({ loading });
  }

  setErrorState(error: string | null): void {
    this.update({ error });
  }

  setCurrentPortfolio(portfolio: Portfolio | null): void {
    this.update({ currentPortfolio: portfolio });
  }

  clearCurrentPortfolio(): void {
    this.update({ currentPortfolio: null });
  }
}

