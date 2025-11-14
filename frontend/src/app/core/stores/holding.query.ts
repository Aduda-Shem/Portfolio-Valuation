import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { HoldingStore, HoldingState } from './holding.store';
import { Holding } from '../../models/holding.model';
import { Observable } from 'rxjs';

/**
 * Holding Query
 * Provides reactive queries for holding state
 */
@Injectable({ providedIn: 'root' })
export class HoldingQuery extends QueryEntity<HoldingState> {
  holdings$!: Observable<Holding[]>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  constructor(protected override store: HoldingStore) {
    super(store);
    this.holdings$ = this.selectAll();
    this.loading$ = this.select(state => state.loading);
    this.error$ = this.select(state => state.error);
  }
}

