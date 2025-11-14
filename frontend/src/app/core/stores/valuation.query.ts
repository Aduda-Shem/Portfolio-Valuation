import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ValuationStore, ValuationState } from './valuation.store';
import { ValuationSnapshot } from '../../models/valuation.model';
import { Observable } from 'rxjs';

/**
 * Valuation Query
 * Provides reactive queries for valuation state
 */
@Injectable({ providedIn: 'root' })
export class ValuationQuery extends QueryEntity<ValuationState> {
  valuations$!: Observable<ValuationSnapshot[]>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  constructor(protected override store: ValuationStore) {
    super(store);
    this.valuations$ = this.selectAll();
    this.loading$ = this.select(state => state.loading);
    this.error$ = this.select(state => state.error);
  }
}

