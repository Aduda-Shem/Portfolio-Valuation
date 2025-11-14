import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Holding } from '../../models/holding.model';

/**
 * Holding State Interface
 */
export interface HoldingState extends EntityState<Holding> {
  loading: boolean;
  error: string | null;
}

/**
 * Holding Store
 * Manages holding state using Akita Entity Store
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'holdings' })
export class HoldingStore extends EntityStore<HoldingState> {
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

