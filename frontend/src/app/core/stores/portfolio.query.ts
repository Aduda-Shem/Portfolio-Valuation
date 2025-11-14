import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { PortfolioStore, PortfolioState } from './portfolio.store';
import { Portfolio } from '../../models/portfolio.model';
import { Observable } from 'rxjs';

/**
 * Portfolio Query
 * Provides reactive queries for portfolio state
 */
@Injectable({ providedIn: 'root' })
export class PortfolioQuery extends QueryEntity<PortfolioState> {
  portfolios$!: Observable<Portfolio[]>;
  currentPortfolio$!: Observable<Portfolio | null>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  constructor(protected override store: PortfolioStore) {
    super(store);
    this.portfolios$ = this.selectAll();
    this.currentPortfolio$ = this.select(state => state.currentPortfolio);
    this.loading$ = this.select(state => state.loading);
    this.error$ = this.select(state => state.error);
  }
}

