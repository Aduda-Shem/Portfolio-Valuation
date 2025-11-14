import { Injectable } from '@angular/core';
import { HoldingStore } from './holding.store';
import { HoldingApiService } from '../services/holding-api.service';
import { CreateHoldingRequest } from '../../models/holding.model';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

/**
 * Holding Service
 * Business logic layer for holding operations
 */
@Injectable({ providedIn: 'root' })
export class HoldingService {
  constructor(
    private holdingStore: HoldingStore,
    private holdingApi: HoldingApiService
  ) {}

  getAll(portfolioId?: number, valuationDate?: string): void {
    this.holdingStore.setLoading(true);
    this.holdingStore.setErrorState(null);

    this.holdingApi.getAll(portfolioId, valuationDate).pipe(
      tap(holdings => {
        this.holdingStore.set(holdings);
        this.holdingStore.setLoading(false);
      }),
      catchError(error => {
        this.holdingStore.setErrorState(error.message || 'Failed to fetch holdings');
        this.holdingStore.setLoading(false);
        return throwError(() => error);
      })
    ).subscribe();
  }

  create(data: CreateHoldingRequest): void {
    this.holdingStore.setErrorState(null);

    this.holdingApi.create(data).pipe(
      tap(holding => {
        this.holdingStore.add(holding);
      }),
      catchError(error => {
        this.holdingStore.setErrorState(error.message || 'Failed to create holding');
        return throwError(() => error);
      })
    ).subscribe();
  }

  update(id: number, data: Partial<CreateHoldingRequest>): void {
    this.holdingStore.setErrorState(null);

    this.holdingApi.update(id, data).pipe(
      tap(holding => {
        this.holdingStore.update(id, holding);
      }),
      catchError(error => {
        this.holdingStore.setErrorState(error.message || 'Failed to update holding');
        return throwError(() => error);
      })
    ).subscribe();
  }

  delete(id: number): void {
    this.holdingStore.setErrorState(null);

    this.holdingApi.deleteById(id).pipe(
      tap(() => {
        this.holdingStore.remove(id);
      }),
      catchError(error => {
        this.holdingStore.setErrorState(error.message || 'Failed to delete holding');
        return throwError(() => error);
      })
    ).subscribe();
  }
}

