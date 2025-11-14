import { Injectable } from '@angular/core';
import { ValuationStore } from './valuation.store';
import { ValuationApiService } from '../services/valuation-api.service';
import { CreateValuationRequest } from '../../models/valuation.model';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

/**
 * Valuation Service
 * Business logic layer for valuation operations
 */
@Injectable({ providedIn: 'root' })
export class ValuationService {
  constructor(
    private valuationStore: ValuationStore,
    private valuationApi: ValuationApiService
  ) {}

  getAll(portfolioId?: number, status?: string, snapshotDate?: string): void {
    this.valuationStore.setLoading(true);
    this.valuationStore.setErrorState(null);

    this.valuationApi.getAll(portfolioId, status, snapshotDate).pipe(
      tap(valuations => {
        this.valuationStore.set(valuations);
        this.valuationStore.setLoading(false);
      }),
      catchError(error => {
        this.valuationStore.setErrorState(error.message || 'Failed to fetch valuations');
        this.valuationStore.setLoading(false);
        return throwError(() => error);
      })
    ).subscribe();
  }

  create(data: CreateValuationRequest): void {
    this.valuationStore.setErrorState(null);

    this.valuationApi.create(data).pipe(
      tap(valuation => {
        this.valuationStore.add(valuation);
      }),
      catchError(error => {
        this.valuationStore.setErrorState(error.message || 'Failed to create valuation');
        return throwError(() => error);
      })
    ).subscribe();
  }

  update(id: number, data: Partial<CreateValuationRequest>): void {
    this.valuationStore.setErrorState(null);

    this.valuationApi.update(id, data).pipe(
      tap(valuation => {
        this.valuationStore.update(id, valuation);
      }),
      catchError(error => {
        this.valuationStore.setErrorState(error.message || 'Failed to update valuation');
        return throwError(() => error);
      })
    ).subscribe();
  }

  delete(id: number): void {
    this.valuationStore.setErrorState(null);

    this.valuationApi.deleteById(id).pipe(
      tap(() => {
        this.valuationStore.remove(id);
      }),
      catchError(error => {
        this.valuationStore.setErrorState(error.message || 'Failed to delete valuation');
        return throwError(() => error);
      })
    ).subscribe();
  }

  recalculate(id: number): void {
    this.valuationStore.setErrorState(null);

    this.valuationApi.recalculate(id).pipe(
      tap(valuation => {
        this.valuationStore.update(id, valuation);
      }),
      catchError(error => {
        this.valuationStore.setErrorState(error.message || 'Failed to recalculate valuation');
        return throwError(() => error);
      })
    ).subscribe();
  }

  updateStatus(id: number, status: string): void {
    this.valuationStore.setErrorState(null);

    this.valuationApi.updateStatus(id, status).pipe(
      tap(valuation => {
        this.valuationStore.update(id, valuation);
      }),
      catchError(error => {
        this.valuationStore.setErrorState(error.message || 'Failed to update valuation status');
        return throwError(() => error);
      })
    ).subscribe();
  }
}

