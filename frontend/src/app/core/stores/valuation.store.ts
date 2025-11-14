import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { ValuationSnapshot } from '../../models/valuation.model';

/**
 * Valuation State Interface
 */
export interface ValuationState extends EntityState<ValuationSnapshot> {
  loading: boolean;
  error: string | null;
}

/**
 * Valuation Store
 * Manages valuation state using Akita Entity Store
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'valuations' })
export class ValuationStore extends EntityStore<ValuationState> {
  constructor() {
    super({
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
}

